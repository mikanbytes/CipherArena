import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";

import { CipherArena, CipherArena__factory } from "../types";

type Signers = {
  host: HardhatEthersSigner;
  opponent: HardhatEthersSigner;
  spectator: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("CipherArena")) as CipherArena__factory;
  const contract = (await factory.deploy()) as CipherArena;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

describe("CipherArena", function () {
  let signers: Signers;
  let cipherArena: CipherArena;
  let cipherArenaAddress: string;

  before(async function () {
    const [host, opponent, spectator] = await ethers.getSigners();
    signers = { host, opponent, spectator };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      this.skip();
    }

    ({ contract: cipherArena, contractAddress: cipherArenaAddress } = await deployFixture());
  });

  it("creates games and joins players", async function () {
    await cipherArena.connect(signers.host).createGame();

    const games = await cipherArena.getGames();
    expect(games.length).to.eq(1);
    const gameId = games[0].gameId;
    expect(games[0].host).to.eq(signers.host.address);
    expect(games[0].opponent).to.eq(ethers.ZeroAddress);
    expect(games[0].started).to.eq(false);

    await cipherArena.connect(signers.opponent).joinGame(gameId);

    const updatedGames = await cipherArena.getGames();
    expect(updatedGames[0].opponent).to.eq(signers.opponent.address);
  });

  it("deals cards and resolves a round", async function () {
    await cipherArena.connect(signers.host).createGame();
    const gamesAfterCreate = await cipherArena.getGames();
    const gameId = gamesAfterCreate[0].gameId;
    await cipherArena.connect(signers.opponent).joinGame(gameId);

    await cipherArena.connect(signers.host).startGame(gameId);

    const hostCardsResult = await cipherArena.getPlayerCards(gameId, signers.host.address);
    const opponentCardsResult = await cipherArena.getPlayerCards(gameId, signers.opponent.address);

    const hostCardEncrypted = hostCardsResult[0][0];
    const opponentCardEncrypted = opponentCardsResult[0][0];

    const hostCardValue = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      hostCardEncrypted,
      cipherArenaAddress,
      signers.host,
    );
    const opponentCardValue = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      opponentCardEncrypted,
      cipherArenaAddress,
      signers.opponent,
    );

    expect(hostCardValue).to.be.gte(1n).and.lte(5n);
    expect(opponentCardValue).to.be.gte(1n).and.lte(5n);

    await cipherArena.connect(signers.host).playCard(gameId, 0);

    const hostStatusAfterPlay = await cipherArena.getPlayerStatus(gameId, signers.host.address);
    expect(hostStatusAfterPlay[1][0]).to.eq(true);

    await cipherArena.connect(signers.opponent).playCard(gameId, 0);

    const roundOutcome = await cipherArena.getRoundOutcome(gameId, 0);
    expect(roundOutcome[1]).to.eq(true);

    const decryptedOutcome = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      roundOutcome[0],
      cipherArenaAddress,
      signers.host,
    );

    if (hostCardValue === opponentCardValue) {
      expect(decryptedOutcome).to.eq(0n);
    } else if (hostCardValue > opponentCardValue) {
      expect(decryptedOutcome).to.eq(1n);
    } else {
      expect(decryptedOutcome).to.eq(2n);
    }

    const games = await cipherArena.getGames();
    expect(games[0].currentRound).to.eq(1);
  });
});
