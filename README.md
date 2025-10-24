# CipherArena

<div align="center">

**A Privacy-Preserving On-Chain Card Game Built with Fully Homomorphic Encryption**

[![License](https://img.shields.io/badge/license-BSD--3--Clause--Clear-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/solidity-0.8.27-brightgreen.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/hardhat-2.26.0-yellow.svg)](https://hardhat.org/)
[![FHEVM](https://img.shields.io/badge/FHEVM-Zama-purple.svg)](https://docs.zama.ai/fhevm)

</div>

---

## Table of Contents

- [Introduction](#introduction)
- [Key Advantages](#key-advantages)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Problems Solved](#problems-solved)
- [Game Mechanics](#game-mechanics)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Project](#running-the-project)
- [Development](#development)
  - [Smart Contract Development](#smart-contract-development)
  - [Frontend Development](#frontend-development)
  - [Testing](#testing)
  - [Deployment](#deployment)
- [Usage](#usage)
  - [Creating a Game](#creating-a-game)
  - [Playing the Game](#playing-the-game)
  - [Viewing Game State](#viewing-game-state)
- [Architecture](#architecture)
  - [Smart Contract Architecture](#smart-contract-architecture)
  - [Encryption Flow](#encryption-flow)
- [Security Considerations](#security-considerations)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [Resources](#resources)
- [License](#license)
- [Support](#support)

---

## Introduction

**CipherArena** is a groundbreaking blockchain-based card game that leverages **Fully Homomorphic Encryption (FHE)** to enable completely private, on-chain gameplay. Unlike traditional blockchain games where all data is publicly visible, CipherArena ensures that players' cards remain encrypted throughout the entire game, preventing cheating while maintaining transparency and verifiability.

The game demonstrates a revolutionary use case for FHE in blockchain gaming: players can compete in strategic card battles where their card values remain secret until they choose to reveal them, all while the game logic executes entirely on-chain without any trusted third parties.

### What Makes CipherArena Special?

- **True On-Chain Privacy**: Cards are encrypted at the protocol level and remain hidden during gameplay
- **Zero-Knowledge Gameplay**: Players cannot see their opponent's cards or predict outcomes
- **Cryptographically Secure Randomness**: Card distribution uses FHE-based random number generation
- **Trustless Verification**: All game outcomes are computed on encrypted data and verifiable on-chain
- **Fair Competition**: No player advantage through transaction frontrunning or data inspection

---

## Key Advantages

### 1. Complete Privacy Preservation

Traditional blockchain games face a fundamental challenge: all state is public. CipherArena solves this using **Fully Homomorphic Encryption (FHE)**, which allows computations to be performed on encrypted data without ever decrypting it. This means:

- **Hidden Cards**: Each player's hand remains completely private
- **Unpredictable Outcomes**: Round results cannot be predicted before resolution
- **No Information Leakage**: Even blockchain validators cannot see card values
- **Player-Only Decryption**: Only the card owner can decrypt their own cards

### 2. No Trusted Third Party Required

Unlike traditional online games that rely on centralized servers:

- **Fully Decentralized**: No game server needed to manage secrets
- **Transparent Logic**: All game rules are enforced by immutable smart contracts
- **Verifiable Outcomes**: Anyone can verify the game proceeded fairly
- **Censorship Resistant**: No entity can prevent gameplay or alter results

### 3. Cheat-Proof Architecture

The combination of FHE and blockchain provides unprecedented security:

- **No Card Counting**: Players cannot analyze blockchain data to gain advantages
- **MEV Resistant**: Miners/validators cannot manipulate game outcomes
- **Frontrunning Impossible**: Encrypted cards prevent strategic transaction ordering attacks
- **Immutable History**: Complete audit trail of all game actions

### 4. Developer-Friendly Infrastructure

Built on battle-tested tools and frameworks:

- **Hardhat Integration**: Standard Ethereum development workflow
- **Comprehensive Testing**: Full test suite with encrypted value verification
- **Easy Deployment**: One-command deployment to Sepolia testnet
- **Rich Tooling**: Custom Hardhat tasks for game interaction and debugging

---

## How It Works

CipherArena implements a strategic card game where:

1. **Game Creation**: A host creates a game and waits for an opponent to join
2. **Card Dealing**: When the game starts, each player receives 5 encrypted cards (values 1-5)
3. **Round-Based Play**: Over 5 rounds, players select cards to play against each other
4. **Private Comparison**: The smart contract compares encrypted cards without revealing values
5. **Encrypted Outcomes**: Results are computed on encrypted data and can be decrypted by participants
6. **Single-Use Cards**: Each card can only be played once per game

The entire game state—cards, plays, and outcomes—remains encrypted on-chain. Only authorized players can decrypt their own cards and the outcomes of rounds they participated in.

---

## Technology Stack

### Blockchain & Encryption

- **[FHEVM (Fully Homomorphic Encryption Virtual Machine)](https://docs.zama.ai/fhevm)**: Zama's groundbreaking FHE protocol for Ethereum
  - Enables computation on encrypted data
  - Provides cryptographically secure privacy guarantees
  - Implements `euint8` and `ebool` encrypted types
  - Supports FHE arithmetic operations (add, multiply, compare, etc.)

- **[Solidity 0.8.27](https://soliditylang.org/)**: Smart contract programming language
  - Latest security features and optimizations
  - Cancun EVM compatibility
  - Custom errors and events

- **[@fhevm/solidity](https://www.npmjs.com/package/@fhevm/solidity)**: FHE library for Solidity
  - `FHE.randEuint8()`: Secure random number generation
  - `FHE.gt()`, `FHE.eq()`: Encrypted comparisons
  - `FHE.select()`: Encrypted conditional logic
  - `FHE.allow()`: Access control for encrypted values

### Development Tools

- **[Hardhat 2.26.0](https://hardhat.org/)**: Ethereum development environment
  - [@fhevm/hardhat-plugin](https://www.npmjs.com/package/@fhevm/hardhat-plugin): FHE integration for testing and deployment
  - [hardhat-deploy](https://www.npmjs.com/package/hardhat-deploy): Deployment management
  - Custom tasks for game interaction
  - TypeScript configuration

- **[Ethers.js v6](https://docs.ethers.org/v6/)**: Ethereum interaction library
  - Contract interaction
  - Transaction management
  - Event listening

- **[TypeChain](https://github.com/dethcrypto/TypeChain)**: TypeScript bindings for contracts
  - Type-safe contract calls
  - Autocomplete support
  - Compile-time error checking

### Testing & Quality

- **[Mocha](https://mochajs.org/)** + **[Chai](https://www.chaijs.com/)**: Testing framework
  - Comprehensive test coverage
  - FHE decryption testing
  - Game flow verification

- **[Solhint](https://github.com/protofire/solhint)**: Solidity linter
  - Security best practices
  - Style enforcement
  - Gas optimization hints

- **[Solidity Coverage](https://github.com/sc-forks/solidity-coverage)**: Code coverage analysis

- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)**: Code formatting and quality

### Frontend (In Development)

- **[React 18](https://react.dev/)**: UI framework
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Vite](https://vitejs.dev/)**: Fast development server and build tool
- **[@fhevm/client-sdk](https://docs.zama.ai/fhevm)**: Client-side FHE operations
  - User-side encryption/decryption
  - Key generation
  - Signature handling

### Network Infrastructure

- **[Sepolia Testnet](https://sepolia.etherscan.io/)**: Ethereum test network
  - FHEVM deployment target
  - Free test ETH available
  - Production-like environment

- **[Infura](https://www.infura.io/)**: Ethereum node provider
  - Reliable RPC endpoints
  - WebSocket support
  - Event monitoring

### Additional Dependencies

- **[OpenZeppelin Contracts](https://www.openzeppelin.com/contracts)**: Via FHEVM dependencies
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Environment variable management
- **[encrypted-types](https://www.npmjs.com/package/encrypted-types)**: TypeScript types for encrypted values

---

## Problems Solved

### 1. The Hidden Information Problem in Blockchain Games

**Problem**: Blockchain's transparent nature makes it impossible to hide game state. Traditional solutions involve:
- Commit-reveal schemes (adds rounds and complexity)
- Off-chain computation (requires trust in servers)
- State channels (limited scalability and complexity)

**CipherArena's Solution**: FHE allows true hidden information on-chain. Cards are encrypted when dealt and remain encrypted during gameplay. All computations (card comparisons, winner determination) happen on encrypted data without ever revealing values.

### 2. Secure Randomness in Smart Contracts

**Problem**: Generating unpredictable random numbers on-chain is challenging. Common approaches:
- Block hashes (predictable by miners)
- Chainlink VRF (external dependency, latency)
- Commit-reveal (requires multiple transactions)

**CipherArena's Solution**: FHEVM's `FHE.randEuint8()` provides cryptographically secure random number generation that produces encrypted values, ensuring cards are truly random and hidden from all parties, including validators.

### 3. Frontrunning and MEV Attacks

**Problem**: In typical blockchain games, players can:
- See pending transactions in the mempool
- Frontrun opponent moves by paying higher gas
- Sandwich attacks on game actions
- Miners can reorder or censor transactions

**CipherArena's Solution**: Since all card values and game decisions are encrypted, there's no information to exploit. Even if an attacker sees a transaction in the mempool, they cannot determine which card is being played or predict the outcome.

### 4. Trusted Game Masters

**Problem**: Traditional online games require:
- Centralized servers to enforce rules
- Trust that the server won't cheat
- Risk of server shutdown or manipulation
- No verifiable fairness

**CipherArena's Solution**: Smart contracts enforce all rules deterministically. FHE ensures fair card dealing and outcome computation. The blockchain provides an immutable audit trail. Players can verify the game proceeded fairly without trusting any central authority.

### 5. Privacy vs. Transparency Tradeoff

**Problem**: Blockchains traditionally force a choice:
- Full transparency (no privacy)
- Off-chain computation (no transparency)
- Zero-knowledge proofs (computational overhead)

**CipherArena's Solution**: FHE provides both privacy and transparency. Game state is public but encrypted. Outcomes are verifiable but values remain hidden. Players can prove fairness without revealing secrets.

---

## Game Mechanics

### Game Flow

```
1. Host creates game       → GameCreated event
2. Opponent joins         → GameJoined event
3. Host starts game       → GameStarted event + Cards dealt
4. Round Loop (5 rounds):
   a. Host plays card     → CardPlayed event
   b. Opponent plays card → CardPlayed event
   c. Round resolves      → RoundResolved event
   d. Advance to next round
5. Game completes after 5 rounds
```

### Card System

- **5 Cards per Player**: Values range from 1 to 5
- **Random Distribution**: Each card value is randomly generated using FHE randomness
- **Single Use**: Cards can only be played once per game
- **Encrypted Storage**: All cards remain encrypted (type `euint8`)

### Round Resolution

Each round compares the played cards:

```solidity
Outcome:
- 0 = Tie (cards equal)
- 1 = Host wins (host card > opponent card)
- 2 = Opponent wins (opponent card > host card)
```

The comparison happens entirely on encrypted data:
```solidity
ebool hostWins = FHE.gt(round.hostCard, round.opponentCard);
ebool cardsEqual = FHE.eq(round.hostCard, round.opponentCard);
euint8 outcome = FHE.select(cardsEqual, FHE.asEuint8(0),
                           FHE.select(hostWins, FHE.asEuint8(1), FHE.asEuint8(2)));
```

### Winning Conditions

The current implementation tracks round outcomes but doesn't enforce a final winner. Future versions will implement:
- Score tracking across rounds
- Victory conditions
- Reward distribution

---

## Project Structure

```
CipherArena/
├── contracts/                  # Solidity smart contracts
│   └── CipherArena.sol        # Main game contract with FHE logic
│
├── deploy/                     # Deployment scripts
│   └── deploy.ts              # Hardhat-deploy deployment configuration
│
├── tasks/                      # Custom Hardhat tasks
│   ├── accounts.ts            # Account management tasks
│   └── CipherArena.ts         # Game-specific interaction tasks
│       ├── cipherarena-address      # Get contract address
│       ├── cipherarena-games        # List all games
│       ├── cipherarena-decrypt-card # Decrypt player's card
│       └── cipherarena-decrypt-round # Decrypt round outcome
│
├── test/                       # Test files
│   └── CipherArena.ts         # Comprehensive game tests
│
├── home/                       # Frontend application (React + Vite)
│   ├── src/                   # Frontend source code
│   └── public/                # Static assets
│
├── types/                      # Generated TypeChain types
│
├── hardhat.config.ts          # Hardhat configuration
│   ├── Networks: hardhat, anvil, sepolia
│   ├── Compiler: Solidity 0.8.27 with Cancun EVM
│   ├── Plugins: FHEVM, ethers, typechain, verify
│   └── Gas reporter configuration
│
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── .gitignore                 # Git ignore rules
├── .solhint.json              # Solidity linting rules
└── README.md                  # This file
```

### Key Files

#### `contracts/CipherArena.sol`
The core smart contract implementing the game logic:
- **Structs**: `Game`, `PlayerState`, `RoundState`, `GameSummary`
- **Storage**: Game state mapping and ID tracking
- **Functions**:
  - Game lifecycle: `createGame()`, `joinGame()`, `startGame()`
  - Gameplay: `playCard()`, `_dealCards()`, `_resolveRound()`
  - Views: `getGames()`, `getPlayerCards()`, `getRoundOutcome()`
- **Events**: `GameCreated`, `GameJoined`, `GameStarted`, `CardPlayed`, `RoundResolved`

#### `test/CipherArena.ts`
Comprehensive test suite covering:
- Game creation and joining
- Card dealing with FHE decryption verification
- Card playing and round resolution
- Outcome verification (tie, host win, opponent win)
- Edge cases and access control

#### `tasks/CipherArena.ts`
Hardhat tasks for game interaction:
- Querying game state
- Decrypting encrypted cards (requires private key)
- Monitoring game progress
- Debugging FHE values

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 20 or higher
  ```bash
  node --version  # Should be v20.x.x or higher
  ```

- **npm**: Version 7 or higher (comes with Node.js)
  ```bash
  npm --version  # Should be 7.x.x or higher
  ```

- **Git**: For cloning the repository
  ```bash
  git --version
  ```

- **Wallet**: MetaMask or similar Ethereum wallet (for testnet deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/CipherArena.git
   cd CipherArena
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This installs all required packages including:
   - FHEVM Solidity libraries
   - Hardhat and plugins
   - Testing frameworks
   - TypeScript tooling

3. **Verify installation**

   ```bash
   npm run compile
   ```

   This should compile the contracts without errors.

### Configuration

1. **Set up environment variables**

   The project uses Hardhat's secure variable storage:

   ```bash
   # Set your wallet's private key (for testnet deployment)
   npx hardhat vars set PRIVATE_KEY

   # Set Infura API key for Sepolia access
   npx hardhat vars set INFURA_API_KEY

   # (Optional) Set Etherscan API key for contract verification
   npx hardhat vars set ETHERSCAN_API_KEY
   ```

   **Security Note**: Never commit private keys or seed phrases to version control.

2. **Alternative: Use .env file**

   Create a `.env` file in the project root:

   ```env
   PRIVATE_KEY=your_private_key_here
   INFURA_API_KEY=your_infura_key_here
   ETHERSCAN_API_KEY=your_etherscan_key_here
   ```

3. **Get Sepolia Test ETH**

   Visit a Sepolia faucet to get test ETH:
   - [Sepolia Faucet 1](https://sepoliafaucet.com/)
   - [Sepolia Faucet 2](https://www.alchemy.com/faucets/ethereum-sepolia)
   - [Sepolia Faucet 3](https://faucet.quicknode.com/ethereum/sepolia)

### Running the Project

#### Local Development Network

1. **Start a local Hardhat node**

   ```bash
   npm run chain
   # or
   npx hardhat node
   ```

   This starts a local Ethereum network with FHEVM support.

2. **Deploy contracts (in a new terminal)**

   ```bash
   npm run deploy:localhost
   # or
   npx hardhat deploy --network localhost
   ```

3. **Run tests**

   ```bash
   npm test
   # or
   npm run test
   ```

#### Sepolia Testnet

1. **Deploy to Sepolia**

   ```bash
   npm run deploy:sepolia
   # or
   npx hardhat deploy --network sepolia
   ```

2. **Verify contract on Etherscan**

   ```bash
   npm run verify:sepolia
   # or
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

3. **Run tests on Sepolia**

   ```bash
   npm run test:sepolia
   # or
   npx hardhat test --network sepolia
   ```

---

## Development

### Smart Contract Development

#### Compile Contracts

```bash
npm run compile
```

This:
- Compiles Solidity contracts
- Generates TypeChain types
- Creates ABIs in `artifacts/`

#### Test Contracts

```bash
# Run all tests
npm test

# Run with coverage
npm run coverage

# Run with gas reporting
REPORT_GAS=true npm test
```

#### Lint and Format

```bash
# Check code quality
npm run lint

# Fix formatting issues
npm run prettier:write

# Check formatting
npm run prettier:check
```

### Frontend Development

The frontend is located in the `home/` directory.

```bash
cd home
npm install
npm run dev
```

This starts the Vite development server with hot module replacement.

### Testing

#### Running Tests

The test suite verifies:
- Game creation and lifecycle
- Card dealing with proper encryption
- Card playing mechanics
- Round resolution logic
- FHE decryption accuracy

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/CipherArena.ts

# Run with detailed output
npx hardhat test --verbose
```

#### Test Structure

```typescript
describe("CipherArena", function () {
  // Game creation and joining
  it("creates games and joins players", async function () { ... });

  // Card dealing and round resolution
  it("deals cards and resolves a round", async function () { ... });
});
```

#### FHE Decryption in Tests

Tests can decrypt encrypted values for verification:

```typescript
const decryptedCard = await fhevm.userDecryptEuint(
  FhevmType.euint8,
  encryptedCard,
  contractAddress,
  signer
);
```

### Deployment

#### Local Deployment

```bash
# Start local node
npx hardhat node

# Deploy (in another terminal)
npx hardhat deploy --network localhost

# Get contract address
npx hardhat task:cipherarena-address --network localhost
```

#### Sepolia Deployment

```bash
# Deploy to Sepolia
npx hardhat deploy --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

#### Deployment Output

After successful deployment:

```
Deploying CipherArena...
✅ CipherArena deployed to: 0x1234...5678
⛽ Gas used: 2,345,678
📝 Contract verified on Etherscan
```

---

## Usage

### Creating a Game

Using Hardhat console:

```javascript
const [host] = await ethers.getSigners();
const CipherArena = await ethers.getContractAt("CipherArena", CONTRACT_ADDRESS);

const tx = await CipherArena.connect(host).createGame();
await tx.wait();
console.log("Game created!");
```

### Playing the Game

```javascript
const [host, opponent] = await ethers.getSigners();

// Join game
await CipherArena.connect(opponent).joinGame(0);

// Start game (deals encrypted cards)
await CipherArena.connect(host).startGame(0);

// Play cards
await CipherArena.connect(host).playCard(0, 0);  // gameId=0, cardIndex=0
await CipherArena.connect(opponent).playCard(0, 1);  // gameId=0, cardIndex=1

// Round auto-resolves when both players have played
```

### Viewing Game State

Using Hardhat tasks:

```bash
# List all games
npx hardhat task:cipherarena-games --network sepolia

# Decrypt your card
npx hardhat task:cipherarena-decrypt-card \
  --game-id 0 \
  --player 0xYourAddress \
  --index 0 \
  --network sepolia

# View round outcome
npx hardhat task:cipherarena-decrypt-round \
  --game-id 0 \
  --round 0 \
  --player 0xYourAddress \
  --network sepolia
```

### Programmatic Interaction

```typescript
import { ethers } from "hardhat";

// Get game summary
const games = await cipherArena.getGames();
console.log(`Total games: ${games.length}`);

// Get player's cards (encrypted)
const [cards, used] = await cipherArena.getPlayerCards(gameId, playerAddress);

// Get round outcome (encrypted)
const [outcome, resolved] = await cipherArena.getRoundOutcome(gameId, roundIndex);
```

---

## Architecture

### Smart Contract Architecture

```
CipherArena Contract
│
├── State Management
│   ├── _games: mapping(uint256 => Game)
│   ├── _gameIds: uint256[]
│   └── _nextGameId: uint256
│
├── Game Struct
│   ├── host: address
│   ├── opponent: address
│   ├── started: bool
│   ├── currentRound: uint8
│   ├── playerStates: mapping(address => PlayerState)
│   └── rounds: mapping(uint8 => RoundState)
│
├── PlayerState Struct
│   ├── cards: euint8[5]           (FHE encrypted)
│   ├── cardUsed: bool[5]
│   └── cardsPlayed: uint8
│
└── RoundState Struct
    ├── hostPlayed: bool
    ├── opponentPlayed: bool
    ├── resolved: bool
    ├── hostCard: euint8           (FHE encrypted)
    ├── opponentCard: euint8       (FHE encrypted)
    └── outcome: euint8            (FHE encrypted)
```

### Encryption Flow

```
1. Card Generation:
   FHE.randEuint8() → euint8 rawRandom
   FHE.rem(rawRandom, 5) → euint8 bounded (0-4)
   FHE.add(bounded, 1) → euint8 card (1-5)

2. Card Storage:
   FHE.allowThis(card) → Contract can use card
   FHE.allow(card, player) → Player can decrypt card

3. Round Resolution:
   FHE.gt(hostCard, opponentCard) → ebool hostWins
   FHE.eq(hostCard, opponentCard) → ebool cardsEqual
   FHE.select(...) → euint8 outcome (0=tie, 1=host, 2=opponent)

4. Outcome Access:
   FHE.allow(outcome, host) → Host can decrypt
   FHE.allow(outcome, opponent) → Opponent can decrypt
```

### Data Flow Diagram

```
Host                  Contract (On-Chain)              Opponent
 │                                                          │
 ├─ createGame() ──────────────────────────────────────────┤
 │                    Game State: {                        │
 │                      host: hostAddr,                    │
 │                      opponent: 0x0                      │
 │                    }                                    │
 │                                                          │
 │  ◄─────────────────── GameCreated Event                 │
 │                                                          │
 │                        joinGame() ◄─────────────────────┤
 │                    Game State: {                        │
 │                      opponent: opponentAddr             │
 │                    }                                    │
 │                                                          │
 ├─ startGame() ─────────────────────────────────────────┐ │
 │                    ┌─ _dealCards(host) ───────────┐  │ │
 │                    │   FHE.randEuint8() × 5       │  │ │
 │                    │   → encrypted cards          │  │ │
 │                    │   FHE.allow(card, host)      │  │ │
 │                    └──────────────────────────────┘  │ │
 │                    ┌─ _dealCards(opponent) ────────┐│ │
 │                    │   FHE.randEuint8() × 5        ││ │
 │                    │   → encrypted cards           ││ │
 │                    │   FHE.allow(card, opponent)   ││ │
 │                    └───────────────────────────────┘│ │
 │                                                      │ │
 │  ◄───────────────── GameStarted Event ──────────────┴─┤
 │                                                          │
 ├─ playCard(0, 0) ────────────────────────────────────────┤
 │                    Round State: {                       │
 │                      hostCard: cards[0],                │
 │                      hostPlayed: true                   │
 │                    }                                    │
 │                                                          │
 │                        playCard(0, 1) ◄─────────────────┤
 │                    Round State: {                       │
 │                      opponentCard: cards[1],            │
 │                      opponentPlayed: true               │
 │                    }                                    │
 │                    ┌─ _resolveRound() ──────────────┐  │
 │                    │  FHE.gt(hostCard, opponentCard)│  │
 │                    │  FHE.eq(hostCard, opponentCard)│  │
 │                    │  FHE.select(...) → outcome     │  │
 │                    │  FHE.allow(outcome, host)      │  │
 │                    │  FHE.allow(outcome, opponent)  │  │
 │                    └────────────────────────────────┘  │
 │                                                          │
 │  ◄───────────────── RoundResolved Event ────────────────┤
 │                                                          │
 ├─ Decrypt outcome ────────────────────────────────────────┤
 │  (off-chain)                                             │
 │                                                          │
```

### Security Model

```
┌─────────────────────────────────────────────────────────┐
│                     CipherArena Security                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Smart Contract Security                       │
│  ├─ Access Control: onlyParticipant modifier            │
│  ├─ State Validation: Game existence checks             │
│  ├─ Replay Protection: Single-use cards                 │
│  └─ Reentrancy Safe: No external calls                  │
│                                                          │
│  Layer 2: FHE Cryptographic Security                    │
│  ├─ Data Encryption: All sensitive values encrypted     │
│  ├─ Access Control: FHE.allow() permissions             │
│  ├─ Secure Randomness: FHE.randEuint8()                 │
│  └─ Computation Privacy: FHE operations on encrypted    │
│                                                          │
│  Layer 3: Blockchain Security                           │
│  ├─ Immutability: Game history cannot be altered        │
│  ├─ Censorship Resistance: No central authority         │
│  ├─ Verifiability: All actions recorded on-chain        │
│  └─ MEV Protection: No exploitable information leaked   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Security Considerations

### FHE Security

1. **Encrypted Value Access Control**
   - Only authorized addresses can decrypt values
   - `FHE.allow()` explicitly grants decryption rights
   - Players can only decrypt their own cards and shared outcomes

2. **Secure Randomness**
   - Uses FHEVM's built-in `FHE.randEuint8()` for card generation
   - Randomness is generated in encrypted form
   - No way for players or validators to predict or manipulate card values

3. **Computation Privacy**
   - All card comparisons happen on encrypted data
   - Intermediate computation results remain encrypted
   - Only final outcomes are made decryptable to participants

### Smart Contract Security

1. **Access Control**
   - `onlyExistingGame` modifier validates game existence
   - `onlyParticipant` modifier restricts actions to game players
   - State checks prevent invalid state transitions

2. **Replay Protection**
   - `cardUsed` array prevents cards from being played twice
   - `currentRound` tracking prevents round replay
   - `started` and `resolved` flags prevent state manipulation

3. **Input Validation**
   - Card index bounds checking
   - Round index validation
   - Player address verification

### Known Limitations

1. **Gas Costs**: FHE operations are more expensive than regular computations
2. **Decryption Latency**: Client-side decryption requires user signatures
3. **Network Dependency**: Requires FHEVM-compatible network (currently Sepolia testnet)
4. **No Score Tracking**: Current version doesn't track overall winner (planned for v2)

### Best Practices

1. **Never Store Private Keys in Code**: Use Hardhat vars or hardware wallets
2. **Test on Testnet First**: Always deploy to Sepolia before mainnet
3. **Verify Contracts**: Use Etherscan verification for transparency
4. **Monitor Gas Costs**: FHE operations can be expensive
5. **Handle Decryption Errors**: Client-side decryption can fail

---

## Future Roadmap

### Version 2.0 - Enhanced Gameplay
- [ ] **Scoring System**: Track wins across rounds and determine overall game winner
- [ ] **Token Rewards**: ERC-20 token rewards for winners
- [ ] **Betting System**: Allow players to wager on games
- [ ] **Multiple Card Sets**: Different card distributions (1-5, 1-10, special cards)
- [ ] **Game Variants**: Different rule sets and game modes

### Version 3.0 - Advanced Features
- [ ] **Tournament System**: Multi-game tournaments with brackets
- [ ] **Matchmaking**: On-chain matchmaking algorithm
- [ ] **Leaderboard**: Player rankings and statistics
- [ ] **Replay System**: View past games and outcomes
- [ ] **Achievements**: On-chain achievement NFTs

### Frontend Development
- [ ] **Web Interface**: React-based game UI
- [ ] **Wallet Integration**: MetaMask, WalletConnect support
- [ ] **Game Visualization**: Animated card plays and outcomes
- [ ] **Mobile Support**: Responsive design for mobile devices
- [ ] **Real-time Updates**: Event monitoring for live game updates

### Infrastructure Improvements
- [ ] **Mainnet Deployment**: Deploy to FHEVM mainnet when available
- [ ] **Cross-Chain Support**: Bridge to other chains
- [ ] **Subgraph**: The Graph indexing for efficient queries
- [ ] **IPFS Integration**: Decentralized storage for game assets
- [ ] **Gasless Transactions**: Meta-transactions for better UX

### Developer Experience
- [ ] **SDK**: JavaScript/TypeScript SDK for game integration
- [ ] **Documentation Site**: Comprehensive docs with tutorials
- [ ] **Video Tutorials**: Step-by-step guides
- [ ] **Smart Contract Templates**: Reusable FHE game components
- [ ] **Testing Framework**: Enhanced testing utilities for FHE games

### Community Features
- [ ] **Social Integration**: Profiles, friends, chat
- [ ] **Customization**: Avatar systems, card skins
- [ ] **Guild System**: Teams and cooperative gameplay
- [ ] **Content Creation**: User-generated game modes
- [ ] **Governance**: DAO for game development decisions

---

## Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**: Open an issue describing the bug and steps to reproduce
2. **Suggest Features**: Share your ideas for new game features or improvements
3. **Submit Pull Requests**: Fix bugs, add features, or improve documentation
4. **Improve Documentation**: Help make the docs clearer and more comprehensive
5. **Write Tests**: Increase test coverage and add edge case testing
6. **Share Feedback**: Let us know your experience using CipherArena

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run lint
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Coding Standards

- Follow the existing code style
- Write tests for new features
- Update documentation for API changes
- Run `npm run lint` before committing
- Use meaningful commit messages

### Testing Requirements

- All tests must pass: `npm test`
- Maintain or improve code coverage
- Add tests for new features
- Test on both local and Sepolia networks

---

## Resources

### FHEVM & Zama Documentation

- [FHEVM Official Documentation](https://docs.zama.ai/fhevm)
- [Getting Started with FHEVM](https://docs.zama.ai/protocol/solidity-guides/getting-started)
- [FHEVM Hardhat Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)
- [FHE Operations Reference](https://docs.zama.ai/protocol/solidity-guides/development-guide/api-reference)
- [Zama GitHub](https://github.com/zama-ai/fhevm)
- [Zama Discord Community](https://discord.gg/zama)

### Hardhat & Development Tools

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [TypeChain Documentation](https://github.com/dethcrypto/TypeChain#readme)
- [Hardhat Deploy Plugin](https://github.com/wighawag/hardhat-deploy)

### Ethereum & Blockchain

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Development Documentation](https://ethereum.org/en/developers/docs/)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)
- [Infura Documentation](https://docs.infura.io/)

### Learning Resources

- [Fully Homomorphic Encryption Explained](https://en.wikipedia.org/wiki/Homomorphic_encryption)
- [Zama Blog](https://www.zama.ai/blog)
- [FHEVM Use Cases](https://www.zama.ai/fhevm)
- [Solidity by Example](https://solidity-by-example.org/)

### Related Projects

- [FHEVM Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [Zama's Example Contracts](https://github.com/zama-ai/fhevm-contracts)
- [Encrypted ERC-20](https://docs.zama.ai/protocol/solidity-guides/examples/erc20)

---

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

Copyright (c) 2025, CipherArena Contributors

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

**NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE.** This software is provided by the copyright holders and contributors "as is" and any express or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed.

See the [LICENSE](LICENSE) file for the full license text.

---

## Support

Need help or have questions?

### Get Help

- **Documentation**: Read through this README and the [FHEVM docs](https://docs.zama.ai/fhevm)
- **GitHub Issues**: [Open an issue](https://github.com/yourusername/CipherArena/issues) for bugs or questions
- **Discord**: Join the [Zama Discord](https://discord.gg/zama) for community support
- **Email**: Contact the maintainers at [email@example.com](mailto:email@example.com)

### Report Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email security concerns to [security@example.com](mailto:security@example.com)
3. Include detailed steps to reproduce the issue
4. Allow time for the team to address the vulnerability before public disclosure

### Community

- **Twitter**: [@CipherArena](https://twitter.com/cipherarena) (placeholder)
- **Discord**: [CipherArena Server](https://discord.gg/cipherarena) (placeholder)
- **Forum**: [Discussion Forum](https://forum.cipherarena.io) (placeholder)

---

## Acknowledgments

This project builds upon the groundbreaking work of:

- **[Zama](https://www.zama.ai/)**: For developing FHEVM and making FHE accessible for smart contracts
- **[FHEVM Team](https://github.com/zama-ai/fhevm)**: For the excellent libraries and documentation
- **Hardhat Team**: For the robust development framework
- **OpenZeppelin**: For smart contract security standards
- **Ethereum Community**: For the decentralized infrastructure

Special thanks to all contributors and community members who help improve CipherArena!

---

<div align="center">

**Built with [FHEVM](https://docs.zama.ai/fhevm) by [Zama](https://www.zama.ai/)**

⭐ Star us on GitHub if you find this project interesting!

[Report Bug](https://github.com/yourusername/CipherArena/issues) · [Request Feature](https://github.com/yourusername/CipherArena/issues) · [Documentation](https://docs.zama.ai/fhevm)

</div>
