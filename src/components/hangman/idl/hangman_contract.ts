export type HangmanContract = {
  version: "0.1.0";
  name: "hangman_contract";
  instructions: [
    {
      name: "initializeLevelOne";
      accounts: [
        {
          name: "newGameDataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "chestVaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "chestReward";
          type: "u64";
        },
        {
          name: "password";
          type: "string";
        },
        {
          name: "maxAttempts";
          type: "u8";
        },
        {
          name: "entryFee";
          type: "u64";
        },
      ];
    },
    {
      name: "playerStartsGame";
      accounts: [
        {
          name: "gameDataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "chestVaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: "getChestReward";
      accounts: [
        {
          name: "gameDataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "chestVaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "player";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: "addCorrectLetter";
      accounts: [
        {
          name: "gameDataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "chestVaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "player";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "letter";
          type: "string";
        },
        {
          name: "indexes";
          type: "bytes";
        },
      ];
    },
    {
      name: "addIncorrectLetter";
      accounts: [
        {
          name: "gameDataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "chestVaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "player";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "letter";
          type: "string";
        },
      ];
    },
    {
      name: "withdraw";
      accounts: [
        {
          name: "gameDataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "chestVaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
  ];
  accounts: [
    {
      name: "GameDataAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "allCreators";
            type: {
              vec: "publicKey";
            };
          },
        ];
      };
    },
    {
      name: "ChestVaultAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "creator";
            type: "publicKey";
          },
          {
            name: "chestReward";
            type: "u64";
          },
          {
            name: "password";
            type: "string";
          },
          {
            name: "maxAttemptsLeft";
            type: "u8";
          },
          {
            name: "entryFee";
            type: "u64";
          },
          {
            name: "players";
            type: {
              vec: {
                defined: "GameRecord";
              };
            };
          },
        ];
      };
    },
  ];
  types: [
    {
      name: "GameRecord";
      type: {
        kind: "struct";
        fields: [
          {
            name: "player";
            type: "publicKey";
          },
          {
            name: "playerScore";
            type: "u8";
          },
          {
            name: "playerPosition";
            type: "u8";
          },
          {
            name: "incorrectGuesses";
            type: {
              vec: "string";
            };
          },
          {
            name: "correctLetters";
            type: {
              vec: "string";
            };
          },
          {
            name: "isWinner";
            type: "bool";
          },
        ];
      };
    },
  ];
  metadata: {
    address: "GsMHDbJU6hZx3yF2adbsyrC5aBcjw4XbewJQbLKwtrBe";
  };
};

export const IDL: HangmanContract = {
  version: "0.1.0",
  name: "hangman_contract",
  instructions: [
    {
      name: "initializeLevelOne",
      accounts: [
        {
          name: "newGameDataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "chestVaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "chestReward",
          type: "u64",
        },
        {
          name: "password",
          type: "string",
        },
        {
          name: "maxAttempts",
          type: "u8",
        },
        {
          name: "entryFee",
          type: "u64",
        },
      ],
    },
    {
      name: "playerStartsGame",
      accounts: [
        {
          name: "gameDataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "chestVaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "getChestReward",
      accounts: [
        {
          name: "gameDataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "chestVaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "player",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "addCorrectLetter",
      accounts: [
        {
          name: "gameDataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "chestVaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "player",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "letter",
          type: "string",
        },
        {
          name: "indexes",
          type: "bytes",
        },
      ],
    },
    {
      name: "addIncorrectLetter",
      accounts: [
        {
          name: "gameDataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "chestVaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "player",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "letter",
          type: "string",
        },
      ],
    },
    {
      name: "withdraw",
      accounts: [
        {
          name: "gameDataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "chestVaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "GameDataAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "allCreators",
            type: {
              vec: "publicKey",
            },
          },
        ],
      },
    },
    {
      name: "ChestVaultAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "creator",
            type: "publicKey",
          },
          {
            name: "chestReward",
            type: "u64",
          },
          {
            name: "password",
            type: "string",
          },
          {
            name: "maxAttemptsLeft",
            type: "u8",
          },
          {
            name: "entryFee",
            type: "u64",
          },
          {
            name: "players",
            type: {
              vec: {
                defined: "GameRecord",
              },
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "GameRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "player",
            type: "publicKey",
          },
          {
            name: "playerScore",
            type: "u8",
          },
          {
            name: "playerPosition",
            type: "u8",
          },
          {
            name: "incorrectGuesses",
            type: {
              vec: "string",
            },
          },
          {
            name: "correctLetters",
            type: {
              vec: "string",
            },
          },
          {
            name: "isWinner",
            type: "bool",
          },
        ],
      },
    },
  ],
  metadata: {
    address: "GsMHDbJU6hZx3yF2adbsyrC5aBcjw4XbewJQbLKwtrBe",
  },
};
