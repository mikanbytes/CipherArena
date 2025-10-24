import { task, types } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { FhevmType } from "@fhevm/hardhat-plugin";

task("task:cipherarena-address", "Prints the CipherArena contract address").setAction(async function (
  _taskArguments: TaskArguments,
  hre,
) {
  const { deployments } = hre;
  const deployment = await deployments.get("CipherArena");
  console.log(`CipherArena address is ${deployment.address}`);
});

task("task:cipherarena-games", "Lists all CipherArena games")
  .addOptionalParam("address", "Contract address override")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const deployment = taskArguments.address ? { address: taskArguments.address } : await deployments.get("CipherArena");
    const contract = await ethers.getContractAt("CipherArena", deployment.address);

    const games = await contract.getGames();

    console.log(`Found ${games.length} game(s)`);
    games.forEach((game, index) => {
      console.log(
        `${index}: id=${game.gameId.toString()} host=${game.host} opponent=${game.opponent} started=${game.started} currentRound=${game.currentRound}`,
      );
    });
  });

task("task:cipherarena-decrypt-card", "Decrypts a specific player's card")
  .addParam("gameId", "Game identifier", undefined, types.int)
  .addParam("player", "Player address")
  .addParam("index", "Card index (0-4)", undefined, types.int)
  .addOptionalParam("address", "Contract address override")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const contractAddress = taskArguments.address
      ? (taskArguments.address as string)
      : (await deployments.get("CipherArena")).address;

    const contract = await ethers.getContractAt("CipherArena", contractAddress);

    const gameId = Number(taskArguments.gameId);
    const cardIndex = Number(taskArguments.index);
    const player = taskArguments.player as string;

    const cardsData = await contract.getPlayerCards(gameId, player);
    const encryptedCard = cardsData[0][cardIndex];

    const signer = await ethers.getSigner(player);

    const clearCard = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedCard,
      contractAddress,
      signer,
    );

    console.log(
      `Game ${gameId} card[${cardIndex}] for ${player} decrypts to ${clearCard.toString()} (encrypted=${encryptedCard})`,
    );
  });

task("task:cipherarena-decrypt-round", "Decrypts the outcome of a round")
  .addParam("gameId", "Game identifier", undefined, types.int)
  .addParam("round", "Round index (0-4)", undefined, types.int)
  .addParam("player", "Player address used for decryption")
  .addOptionalParam("address", "Contract address override")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const contractAddress = taskArguments.address
      ? (taskArguments.address as string)
      : (await deployments.get("CipherArena")).address;

    const contract = await ethers.getContractAt("CipherArena", contractAddress);

    const gameId = Number(taskArguments.gameId);
    const round = Number(taskArguments.round);
    const player = taskArguments.player as string;

    const roundData = await contract.getRoundOutcome(gameId, round);
    const outcomeEncrypted = roundData[0];
    const resolved = roundData[1];

    if (!resolved) {
      console.log(`Round ${round} of game ${gameId} is not resolved yet.`);
      return;
    }

    const signer = await ethers.getSigner(player);

    const outcome = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      outcomeEncrypted,
      contractAddress,
      signer,
    );

    console.log(`Round ${round} of game ${gameId} outcome decrypts to ${outcome.toString()}`);
  });
