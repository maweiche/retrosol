export type Mancala = {
  version: "0.1.0";
  name: "mancala";
  instructions: [
    {
      name: "initializeGameData";
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
      args: [
        {
          name: "entryFee";
          type: "u64";
        },
      ];
    },
    {
      name: "playerJoinsGame";
      accounts: [
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
      name: "makeMove";
      accounts: [
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
          name: "selectedPit";
          type: "u8";
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
            name: "allAuthorities";
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
            name: "authority";
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
            name: "entryFee";
            type: "u64";
          },
          {
            name: "scoreSheet";
            type: {
              defined: "GameRecord";
            };
          },
          {
            name: "gameBoard";
            type: {
              array: ["u8", 14];
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
            name: "playerOne";
            type: "publicKey";
          },
          {
            name: "playerOneScore";
            type: "u8";
          },
          {
            name: "playerTwo";
            type: "publicKey";
          },
          {
            name: "playerTwoScore";
            type: "u8";
          },
          {
            name: "totalMoves";
            type: "u8";
          },
          {
            name: "currentMove";
            type: "publicKey";
          },
          {
            name: "gameOver";
            type: "bool";
          },
          {
            name: "winner";
            type: "publicKey";
          },
        ];
      };
    },
  ];
  metadata: {
    address: "27kjU1HDLsU1kYudhryKg95ji2earYkWunWdyYQhbJjM";
  };
};

export const IDL: Mancala = {
  version: "0.1.0",
  name: "mancala",
  instructions: [
    {
      name: "initializeGameData",
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
      args: [
        {
          name: "entryFee",
          type: "u64",
        },
      ],
    },
    {
      name: "playerJoinsGame",
      accounts: [
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
      name: "makeMove",
      accounts: [
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
          name: "selectedPit",
          type: "u8",
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
            name: "allAuthorities",
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
            name: "authority",
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
            name: "entryFee",
            type: "u64",
          },
          {
            name: "scoreSheet",
            type: {
              defined: "GameRecord",
            },
          },
          {
            name: "gameBoard",
            type: {
              array: ["u8", 14],
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
            name: "playerOne",
            type: "publicKey",
          },
          {
            name: "playerOneScore",
            type: "u8",
          },
          {
            name: "playerTwo",
            type: "publicKey",
          },
          {
            name: "playerTwoScore",
            type: "u8",
          },
          {
            name: "totalMoves",
            type: "u8",
          },
          {
            name: "currentMove",
            type: "publicKey",
          },
          {
            name: "gameOver",
            type: "bool",
          },
          {
            name: "winner",
            type: "publicKey",
          },
        ],
      },
    },
  ],
  metadata: {
    address: "27kjU1HDLsU1kYudhryKg95ji2earYkWunWdyYQhbJjM",
  },
};
