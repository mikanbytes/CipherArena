// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, ebool, euint8} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract CipherArena is SepoliaConfig {
    uint8 private constant TOTAL_ROUNDS = 5;
    uint8 private constant MAX_CARD_VALUE = 5;

    struct PlayerState {
        euint8[TOTAL_ROUNDS] cards;
        bool[TOTAL_ROUNDS] cardUsed;
        uint8 cardsPlayed;
    }

    struct RoundState {
        bool hostPlayed;
        bool opponentPlayed;
        bool resolved;
        euint8 hostCard;
        euint8 opponentCard;
        euint8 outcome;
    }

    struct Game {
        address host;
        address opponent;
        bool started;
        uint8 currentRound;
        mapping(address => PlayerState) playerStates;
        mapping(uint8 => RoundState) rounds;
    }

    struct GameSummary {
        uint256 gameId;
        address host;
        address opponent;
        bool started;
        uint8 currentRound;
    }

    uint256 private _nextGameId;
    mapping(uint256 => Game) private _games;
    uint256[] private _gameIds;

    event GameCreated(uint256 indexed gameId, address indexed host);
    event GameJoined(uint256 indexed gameId, address indexed opponent);
    event GameStarted(uint256 indexed gameId);
    event CardPlayed(uint256 indexed gameId, uint8 indexed round, address indexed player, uint8 cardIndex);
    event RoundResolved(uint256 indexed gameId, uint8 indexed round);

    modifier onlyExistingGame(uint256 gameId) {
        require(_games[gameId].host != address(0), "Game missing");
        _;
    }

    modifier onlyParticipant(uint256 gameId) {
        Game storage game = _games[gameId];
        require(game.host != address(0), "Game missing");
        require(msg.sender == game.host || msg.sender == game.opponent, "Not participant");
        _;
    }

    function createGame() external returns (uint256 gameId) {
        gameId = _nextGameId;
        _nextGameId += 1;

        Game storage game = _games[gameId];
        game.host = msg.sender;

        _gameIds.push(gameId);

        emit GameCreated(gameId, msg.sender);
    }

    function joinGame(uint256 gameId) external onlyExistingGame(gameId) {
        Game storage game = _games[gameId];
        require(!game.started, "Game started");
        require(game.opponent == address(0), "Opponent set");
        require(game.host != msg.sender, "Host only once");

        game.opponent = msg.sender;

        emit GameJoined(gameId, msg.sender);
    }

    function startGame(uint256 gameId) external onlyParticipant(gameId) {
        Game storage game = _games[gameId];
        require(!game.started, "Game started");
        require(game.opponent != address(0), "Need opponent");

        _dealCards(game, game.host);
        _dealCards(game, game.opponent);

        game.started = true;
        game.currentRound = 0;

        emit GameStarted(gameId);
    }

    function playCard(uint256 gameId, uint8 cardIndex) external onlyParticipant(gameId) {
        Game storage game = _games[gameId];
        require(game.started, "Game not started");
        require(game.currentRound < TOTAL_ROUNDS, "All rounds done");
        require(cardIndex < TOTAL_ROUNDS, "Bad index");

        address player = msg.sender;
        PlayerState storage state = game.playerStates[player];
        require(!state.cardUsed[cardIndex], "Card used");

        RoundState storage round = game.rounds[game.currentRound];

        if (player == game.host) {
            require(!round.hostPlayed, "Host played");
            round.hostCard = state.cards[cardIndex];
            round.hostPlayed = true;
        } else {
            require(!round.opponentPlayed, "Opponent played");
            round.opponentCard = state.cards[cardIndex];
            round.opponentPlayed = true;
        }

        state.cardUsed[cardIndex] = true;
        state.cardsPlayed += 1;

        emit CardPlayed(gameId, game.currentRound, player, cardIndex);

        if (round.hostPlayed && round.opponentPlayed && !round.resolved) {
            _resolveRound(game, round);
            emit RoundResolved(gameId, game.currentRound);
            game.currentRound += 1;
        }
    }

    function getGames() external view returns (GameSummary[] memory summaries) {
        uint256 length = _gameIds.length;
        summaries = new GameSummary[](length);
        for (uint256 i = 0; i < length; i++) {
            uint256 gameId = _gameIds[i];
            Game storage game = _games[gameId];
            summaries[i] = GameSummary({
                gameId: gameId,
                host: game.host,
                opponent: game.opponent,
                started: game.started,
                currentRound: game.currentRound
            });
        }
    }

    function getPlayerCards(uint256 gameId, address player)
        external
        view
        onlyExistingGame(gameId)
        returns (euint8[TOTAL_ROUNDS] memory cards, bool[TOTAL_ROUNDS] memory used)
    {
        Game storage game = _games[gameId];
        require(player == game.host || player == game.opponent, "Invalid player");

        PlayerState storage state = game.playerStates[player];
        cards = state.cards;
        used = state.cardUsed;
    }

    function getRoundOutcome(uint256 gameId, uint8 roundIndex)
        external
        view
        onlyExistingGame(gameId)
        returns (euint8 outcome, bool resolved)
    {
        require(roundIndex < TOTAL_ROUNDS, "Bad round");
        RoundState storage round = _games[gameId].rounds[roundIndex];
        return (round.outcome, round.resolved);
    }

    function getPlayerStatus(uint256 gameId, address player)
        external
        view
        onlyExistingGame(gameId)
        returns (uint8 cardsPlayed, bool[TOTAL_ROUNDS] memory used)
    {
        Game storage game = _games[gameId];
        require(player == game.host || player == game.opponent, "Invalid player");
        PlayerState storage state = game.playerStates[player];
        return (state.cardsPlayed, state.cardUsed);
    }

    function totalRounds() external pure returns (uint8) {
        return TOTAL_ROUNDS;
    }

    function _dealCards(Game storage game, address player) private {
        PlayerState storage state = game.playerStates[player];
        state.cardsPlayed = 0;
        for (uint8 i = 0; i < TOTAL_ROUNDS; i++) {
            state.cardUsed[i] = false;
            euint8 rawRandom = FHE.randEuint8();
            euint8 bounded = FHE.rem(rawRandom, MAX_CARD_VALUE);
            euint8 card = FHE.add(bounded, 1);
            state.cards[i] = card;
            FHE.allowThis(card);
            FHE.allow(card, player);
        }
    }

    function _resolveRound(Game storage game, RoundState storage round) private {
        ebool hostWins = FHE.gt(round.hostCard, round.opponentCard);
        ebool cardsEqual = FHE.eq(round.hostCard, round.opponentCard);

        euint8 hostOrOpponent = FHE.select(hostWins, FHE.asEuint8(1), FHE.asEuint8(2));
        euint8 outcome = FHE.select(cardsEqual, FHE.asEuint8(0), hostOrOpponent);

        round.outcome = outcome;
        round.resolved = true;

        FHE.allowThis(outcome);
        FHE.allow(outcome, game.host);
        FHE.allow(outcome, game.opponent);
    }
}
