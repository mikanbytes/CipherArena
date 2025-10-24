export const CONTRACT_ADDRESS = '0xdba1030A416Ab7d86f570fbBAE8c1dde1B718C6e';

export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint8",
        "name": "round",
        "type": "uint8"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "cardIndex",
        "type": "uint8"
      }
    ],
    "name": "CardPlayed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "host",
        "type": "address"
      }
    ],
    "name": "GameCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "opponent",
        "type": "address"
      }
    ],
    "name": "GameJoined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "GameStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint8",
        "name": "round",
        "type": "uint8"
      }
    ],
    "name": "RoundResolved",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "createGame",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGames",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "gameId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "host",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "opponent",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "started",
            "type": "bool"
          },
          {
            "internalType": "uint8",
            "name": "currentRound",
            "type": "uint8"
          }
        ],
        "internalType": "struct CipherArena.GameSummary[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getPlayerCards",
    "outputs": [
      {
        "internalType": "euint8[5]",
        "name": "cards",
        "type": "bytes32[5]"
      },
      {
        "internalType": "bool[5]",
        "name": "used",
        "type": "bool[5]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "roundIndex",
        "type": "uint8"
      }
    ],
    "name": "getRoundOutcome",
    "outputs": [
      {
        "internalType": "euint8",
        "name": "outcome",
        "type": "bytes32"
      },
      {
        "internalType": "bool",
        "name": "resolved",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getPlayerStatus",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "cardsPlayed",
        "type": "uint8"
      },
      {
        "internalType": "bool[5]",
        "name": "used",
        "type": "bool[5]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "joinGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "cardIndex",
        "type": "uint8"
      }
    ],
    "name": "playCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "startGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRounds",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
] as const;
