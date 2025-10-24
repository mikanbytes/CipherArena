import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { Contract } from 'ethers';

import { Header } from './Header';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';

import '../styles/GameApp.css';

type GameSummary = {
  gameId: bigint;
  host: string;
  opponent: string;
  started: boolean;
  currentRound: number;
};

type PlayerCards = {
  handles: string[];
  used: boolean[];
};

type RoundOutcome = {
  handle: string;
  resolved: boolean;
  decrypted: number | null;
};

const TOTAL_ROUNDS = 5;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const OUTCOME_LABEL: Record<number, string> = {
  0: 'Tie',
  1: 'Host wins',
  2: 'Opponent wins',
};

function formatAddress(address?: string | null) {
  if (!address || address === ZERO_ADDRESS) {
    return '—';
  }
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function statusLabel(game: GameSummary) {
  if (game.started) {
    return { label: 'In progress', style: 'started' };
  }
  if (game.opponent !== ZERO_ADDRESS) {
    return { label: 'Ready to start', style: 'full' };
  }
  return { label: 'Waiting opponent', style: 'open' };
}

function extractError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Unexpected error';
}

export function GameApp() {
  const { address, isConnected } = useAccount();
  const signerPromise = useEthersSigner();
  const publicClient = usePublicClient();
  const { instance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();

  const [games, setGames] = useState<GameSummary[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<bigint | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [txPending, setTxPending] = useState(false);
  const [playerCards, setPlayerCards] = useState<PlayerCards | null>(null);
  const [playerStatus, setPlayerStatus] = useState<{ cardsPlayed: number } | null>(null);
  const [decryptedCards, setDecryptedCards] = useState<number[] | null>(null);
  const [rounds, setRounds] = useState<RoundOutcome[]>(
    Array.from({ length: TOTAL_ROUNDS }, () => ({ handle: '', resolved: false, decrypted: null })),
  );

  const [decryptingCards, setDecryptingCards] = useState(false);
  const [decryptingRound, setDecryptingRound] = useState<number | null>(null);

  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedGame = useMemo(
    () => games.find((game) => selectedGameId !== null && game.gameId === selectedGameId) ?? null,
    [games, selectedGameId],
  );

  const isHost = selectedGame && address ? selectedGame.host.toLowerCase() === address.toLowerCase() : false;
  const isOpponent = selectedGame && address ? selectedGame.opponent.toLowerCase() === address.toLowerCase() : false;
  const isParticipant = Boolean(selectedGame && (isHost || isOpponent));

  const fetchGames = useCallback(async () => {
    if (!publicClient) {
      return;
    }

    setGamesLoading(true);
    setGamesError(null);

    try {
      const data = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getGames',
      })) as any[];

      const parsed = data.map((game) => {
        const hostCandidate = (game.host ?? game[1]) as string | undefined;
        const opponentCandidate = (game.opponent ?? game[2]) as string | undefined;
        const hostAddress: string =
          typeof hostCandidate === 'string' && hostCandidate !== '' ? hostCandidate : ZERO_ADDRESS;
        const opponentAddress: string =
          typeof opponentCandidate === 'string' && opponentCandidate !== '' ? opponentCandidate : ZERO_ADDRESS;
        const mapped: GameSummary = {
          gameId: BigInt(game.gameId ?? game[0]),
          host: hostAddress.toLowerCase(),
          opponent: opponentAddress.toLowerCase(),
          started: Boolean(game.started ?? game[3]),
          currentRound: Number(game.currentRound ?? game[4]),
        };
        return mapped;
      });

      setGames(parsed);

      if (parsed.length > 0 && selectedGameId === null) {
        setSelectedGameId(parsed[0].gameId);
      } else if (selectedGameId !== null && !parsed.some((game) => game.gameId === selectedGameId)) {
        setSelectedGameId(parsed[0]?.gameId ?? null);
      }
    } catch (error) {
      setGamesError(extractError(error));
    } finally {
      setGamesLoading(false);
    }
  }, [publicClient, selectedGameId]);

  const fetchGameDetails = useCallback(
    async (gameId: bigint, playerAddress?: string | null) => {
      if (!publicClient) {
        return;
      }

      const game = games.find((item) => item.gameId === gameId);
      if (!game) {
        return;
      }

      const participantAddresses = [game.host.toLowerCase(), game.opponent.toLowerCase()];
      const isPlayer = Boolean(
        playerAddress && participantAddresses.includes((playerAddress as string).toLowerCase()),
      );

      if (isPlayer) {
        const targetAddress = playerAddress as `0x${string}`;
        try {
          const cardsData = (await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getPlayerCards',
            args: [gameId, targetAddress],
          })) as any;

          const statusData = (await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getPlayerStatus',
            args: [gameId, targetAddress],
          })) as any;

          const handles = (cardsData[0] ?? []).map((item: unknown) => String(item));
          const used = (cardsData[1] ?? []).map((item: unknown) => Boolean(item));

          setPlayerCards({ handles, used });
          setPlayerStatus({ cardsPlayed: Number(statusData[0] ?? 0) });
        } catch (error) {
          setPlayerCards(null);
          setPlayerStatus(null);
          setErrorMessage(extractError(error));
        }
      } else {
        setPlayerCards(null);
        setPlayerStatus(null);
      }

      setDecryptedCards(null);

      if (game.started) {
        const results = await Promise.all(
          Array.from({ length: TOTAL_ROUNDS }, (_, index) =>
            publicClient
              .readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'getRoundOutcome',
                args: [gameId, index],
              })
              .then((value) => value as any)
              .catch(() => ['0x0', false]),
          ),
        );

        setRounds(
          results.map((entry) => ({
            handle: String(entry[0] ?? '0x0'),
            resolved: Boolean(entry[1] ?? false),
            decrypted: null,
          })),
        );
      } else {
        setRounds(Array.from({ length: TOTAL_ROUNDS }, () => ({ handle: '', resolved: false, decrypted: null })));
      }
    },
    [games, publicClient],
  );

  useEffect(() => {
    fetchGames();
  }, [fetchGames, refreshKey]);

  useEffect(() => {
    if (selectedGameId !== null) {
      fetchGameDetails(selectedGameId, address);
    }
  }, [fetchGameDetails, selectedGameId, address, refreshKey]);

  const refreshAll = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const ensureSigner = useCallback(async () => {
    const signer = await signerPromise;
    if (!signer) {
      throw new Error('Wallet signer not available');
    }
    return signer;
  }, [signerPromise]);

  const withTransaction = useCallback(
    async <T,>(callback: (contract: Contract) => Promise<T>): Promise<T> => {
      if (!isConnected) {
        throw new Error('Connect wallet to perform this action');
      }

      const signer = await ensureSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setTxPending(true);
      setErrorMessage(null);
      setInfoMessage(null);

      try {
        const result = await callback(contract);
        refreshAll();
        return result;
      } finally {
        setTxPending(false);
      }
    },
    [ensureSigner, isConnected, refreshAll],
  );

  const handleCreateGame = useCallback(async () => {
    try {
      await withTransaction(async (contract) => {
        const tx = await contract.createGame();
        const receipt = await tx.wait();

        try {
          const eventFragment = contract.interface.getEvent('GameCreated');
          const topic = eventFragment?.topicHash;
          if (topic) {
            const createdLog = receipt?.logs?.find((entry: any) => entry.topics?.[0] === topic);

            if (createdLog && createdLog.topics?.[1]) {
              const newId = BigInt(createdLog.topics[1]);
              setSelectedGameId(newId);
            }
          } else {
            console.warn('GameCreated event fragment missing topic hash');
          }
        } catch (eventError) {
          console.warn('Unable to parse GameCreated event', eventError);
        }

        setInfoMessage('New duel opened. Share the game ID with a challenger.');
      });
    } catch (error) {
      setErrorMessage(extractError(error));
    }
  }, [withTransaction]);

  const handleJoinGame = useCallback(
    async (gameId: bigint) => {
      try {
        await withTransaction(async (contract) => {
          const tx = await contract.joinGame(gameId);
          await tx.wait();
          setInfoMessage(`Joined game #${gameId.toString()}. Request the host to start.`);
        });
      } catch (error) {
        setErrorMessage(extractError(error));
      }
    },
    [withTransaction],
  );

  const handleStartGame = useCallback(
    async (gameId: bigint) => {
      try {
        await withTransaction(async (contract) => {
          const tx = await contract.startGame(gameId);
          await tx.wait();
          setInfoMessage('Cards dealt! Decrypt your hand to see the values.');
        });
      } catch (error) {
        setErrorMessage(extractError(error));
      }
    },
    [withTransaction],
  );

  const handlePlayCard = useCallback(
    async (gameId: bigint, cardIndex: number) => {
      try {
        await withTransaction(async (contract) => {
          const tx = await contract.playCard(gameId, cardIndex);
          await tx.wait();
          setInfoMessage(`Card ${cardIndex + 1} submitted.`);
        });
      } catch (error) {
        setErrorMessage(extractError(error));
      }
    },
    [withTransaction],
  );

  const handleDecryptCards = useCallback(async () => {
    if (!instance) {
      setErrorMessage('Encryption service not ready yet');
      return;
    }
    if (!address) {
      setErrorMessage('Connect your wallet to decrypt cards');
      return;
    }
    if (!playerCards || playerCards.handles.length === 0) {
      setErrorMessage('No cards to decrypt');
      return;
    }

    try {
      setDecryptingCards(true);
      setErrorMessage(null);

      const keypair = instance.generateKeypair();
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [CONTRACT_ADDRESS];

      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, timestamp, durationDays);
      const signer = await ensureSigner();

      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message,
      );

      const handlePairs = playerCards.handles.map((handle) => ({
        handle,
        contractAddress: CONTRACT_ADDRESS,
      }));

      const result = await instance.userDecrypt(
        handlePairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        timestamp,
        durationDays,
      );

      const values = playerCards.handles.map((handle) => Number(result[handle] ?? '0'));
      setDecryptedCards(values);
      setInfoMessage('Cards decrypted in your browser.');
    } catch (error) {
      setErrorMessage(extractError(error));
    } finally {
      setDecryptingCards(false);
    }
  }, [address, ensureSigner, instance, playerCards]);

  const handleDecryptRound = useCallback(
    async (roundIndex: number) => {
      if (!instance) {
        setErrorMessage('Encryption service not ready yet');
        return;
      }
      if (!address) {
        setErrorMessage('Connect your wallet to decrypt round outcomes');
        return;
      }

      const round = rounds[roundIndex];
      if (!round || !round.resolved) {
        setErrorMessage('Round not resolved yet');
        return;
      }

      try {
        setDecryptingRound(roundIndex);
        setErrorMessage(null);

        const keypair = instance.generateKeypair();
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const durationDays = '10';
        const contractAddresses = [CONTRACT_ADDRESS];

        const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, timestamp, durationDays);
        const signer = await ensureSigner();

        const signature = await signer.signTypedData(
          eip712.domain,
          { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
          eip712.message,
        );

        const result = await instance.userDecrypt(
          [
            {
              handle: round.handle,
              contractAddress: CONTRACT_ADDRESS,
            },
          ],
          keypair.privateKey,
          keypair.publicKey,
          signature.replace('0x', ''),
          contractAddresses,
          address,
          timestamp,
          durationDays,
        );

        const value = Number(result[round.handle] ?? '0');
        setRounds((previous) =>
          previous.map((entry, index) =>
            index === roundIndex ? { ...entry, decrypted: value } : entry,
          ),
        );
        setInfoMessage(`Round ${roundIndex + 1} outcome decrypted.`);
      } catch (error) {
        setErrorMessage(extractError(error));
      } finally {
        setDecryptingRound(null);
      }
    },
    [address, ensureSigner, instance, rounds],
  );

  const canJoin = selectedGame && !selectedGame.started && selectedGame.opponent === ZERO_ADDRESS && !isHost;
  const canStart = selectedGame && !selectedGame.started && selectedGame.opponent !== ZERO_ADDRESS && isParticipant;
  const canPlay = selectedGame && selectedGame.started && isParticipant;

  return (
    <div className="app-shell">
      <Header />
      <main className="game-app">
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Arena Lobby</h2>
            <button className="action-button ghost" onClick={refreshAll} disabled={gamesLoading}>
              Refresh
            </button>
          </div>
          <div className="game-actions">
            <button className="action-button" onClick={handleCreateGame} disabled={txPending || !isConnected}>
              Open Duel
            </button>
            <span className="inline-text">
              {isConnected ? `Connected as ${formatAddress(address ?? undefined)}` : 'Connect your wallet to play'}
            </span>
          </div>
          {gamesError && <div className="error-banner">{gamesError}</div>}
          {gamesLoading ? (
            <div className="empty-state">Loading games from the chain…</div>
          ) : games.length === 0 ? (
            <div className="empty-state">No games yet. Be the first to open a Cipher Arena duel!</div>
          ) : (
            <div className="game-list">
              {games.map((game) => {
                const status = statusLabel(game);
                return (
                  <div
                    key={game.gameId.toString()}
                    className={`game-card ${selectedGameId === game.gameId ? 'active' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedGameId(game.gameId);
                      setInfoMessage(null);
                      setErrorMessage(null);
                    }}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        setSelectedGameId(game.gameId);
                        setInfoMessage(null);
                        setErrorMessage(null);
                      }
                    }}
                  >
                    <div className="game-meta">
                      <div>
                        <span className="label">Game</span>
                        <span className="value">#{game.gameId.toString()}</span>
                      </div>
                      <div>
                        <span className="label">Host</span>
                        <span className="value">{formatAddress(game.host)}</span>
                      </div>
                      <div>
                        <span className="label">Opponent</span>
                        <span className="value">{formatAddress(game.opponent)}</span>
                      </div>
                      <div className="meta-line">
                        <span className={`status-pill ${status.style}`}>{status.label}</span>
                        <span className="pill">
                          Round {Math.min(game.currentRound, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {selectedGame && (
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Game #{selectedGame.gameId.toString()}</h2>
            </div>
            <div className="game-detail-grid">
              <div className="meta-line">
                <span>Host</span>
                <strong>{formatAddress(selectedGame.host)}</strong>
              </div>
              <div className="meta-line">
                <span>Opponent</span>
                <strong>{formatAddress(selectedGame.opponent)}</strong>
              </div>
              <div className="meta-line">
                <span>Status</span>
                <strong>{statusLabel(selectedGame).label}</strong>
              </div>
            </div>

            <div className="game-actions" style={{ marginTop: '1.5rem' }}>
              {canJoin && (
                <button
                  className="action-button secondary"
                  onClick={() => handleJoinGame(selectedGame.gameId)}
                  disabled={txPending}
                >
                  Join Game
                </button>
              )}
              {canStart && (
                <button
                  className="action-button secondary"
                  onClick={() => handleStartGame(selectedGame.gameId)}
                  disabled={txPending}
                >
                  Start Game
                </button>
              )}
              {isParticipant && selectedGame.started && (
                <button
                  className="action-button"
                  onClick={handleDecryptCards}
                  disabled={decryptingCards || zamaLoading}
                >
                  {decryptingCards ? 'Decrypting…' : 'Decrypt My Cards'}
                </button>
              )}
              {infoMessage && <span className="helper-text">{infoMessage}</span>}
            </div>

            {zamaError && <div className="error-banner">{zamaError}</div>}
            {errorMessage && <div className="error-banner">{errorMessage}</div>}

            {isParticipant && selectedGame.started && playerCards && (
              <div>
                <h3 className="panel-title" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                  Your Hand
                </h3>
                <div className="card-grid">
                  {playerCards.handles.map((handle, index) => {
                    const disabled = playerCards.used[index];
                    const decryptedValue = decryptedCards?.[index] ?? null;
                    return (
                      <div key={handle + index} className={`card-tile ${disabled ? 'disabled' : ''}`}>
                        <span className="card-index">Card {index + 1}</span>
                        <span className="card-value">
                          {decryptedValue !== null ? decryptedValue : (decryptingCards ? '…' : '?')}
                        </span>
                        <div className="card-actions">
                          <span className="helper-text">{disabled ? 'Played' : 'Ready'}</span>
                          <button
                            className="link-button"
                            onClick={() => handlePlayCard(selectedGame.gameId, index)}
                            disabled={disabled || !canPlay || txPending}
                          >
                            Play
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {playerStatus && (
                  <p className="helper-text" style={{ marginTop: '0.75rem' }}>
                    Cards played: {playerStatus.cardsPlayed}/{TOTAL_ROUNDS}
                  </p>
                )}
              </div>
            )}

            {selectedGame.started && (
              <div style={{ marginTop: '2rem' }}>
                <h3 className="panel-title" style={{ marginBottom: '1rem' }}>
                  Round History
                </h3>
                <div className="round-grid">
                  {rounds.map((round, index) => (
                    <div key={`round-${index}`} className={`round-card ${round.resolved ? 'resolved' : ''}`}>
                      <h4 className="round-title">Round {index + 1}</h4>
                      <span className="round-status">
                        {round.resolved ? 'Outcome sealed' : 'Waiting for both cards'}
                      </span>
                      {round.decrypted !== null && (
                        <span className="helper-text">{OUTCOME_LABEL[round.decrypted] ?? 'Unknown outcome'}</span>
                      )}
                      {isParticipant && round.resolved && round.decrypted === null && (
                        <button
                          className="link-button"
                          onClick={() => handleDecryptRound(index)}
                          disabled={decryptingRound === index}
                        >
                          {decryptingRound === index ? 'Decrypting…' : 'Decrypt outcome'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
