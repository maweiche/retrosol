export type BattleshipContract = {
    "version": "0.1.0",
    "name": "battleship_contract",
    "instructions": [
      {
        "name": "initializeGameData",
        "accounts": [
          {
            "name": "gameDataAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "entryFee",
            "type": "u64"
          }
        ]
      },
      {
        "name": "playerJoinsGame",
        "accounts": [
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "choosePlacement",
        "accounts": [
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "selectedSquares",
            "type": {
              "array": [
                {
                  "array": [
                    "u8",
                    10
                  ]
                },
                5
              ]
            }
          }
        ]
      },
      {
        "name": "makeMove",
        "accounts": [
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "selectedSquare",
            "type": {
              "array": [
                "u8",
                2
              ]
            }
          }
        ]
      },
      {
        "name": "withdrawLoot",
        "accounts": [
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "closeAccount",
        "accounts": [
          {
            "name": "gameDataAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "GameDataAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "allCreators",
              "type": {
                "vec": "publicKey"
              }
            }
          ]
        }
      },
      {
        "name": "ChestVaultAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "chestReward",
              "type": "u64"
            },
            {
              "name": "password",
              "type": "string"
            },
            {
              "name": "entryFee",
              "type": "u64"
            },
            {
              "name": "scoreSheet",
              "type": {
                "defined": "GameRecord"
              }
            },
            {
              "name": "gameBoard",
              "type": {
                "array": [
                  {
                    "array": [
                      "u8",
                      10
                    ]
                  },
                  10
                ]
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "GameRecord",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "playerOne",
              "type": "publicKey"
            },
            {
              "name": "playerOneScore",
              "type": "u8"
            },
            {
              "name": "playerTwo",
              "type": "publicKey"
            },
            {
              "name": "playerTwoScore",
              "type": "u8"
            },
            {
              "name": "currentMove",
              "type": "publicKey"
            },
            {
              "name": "gameOver",
              "type": "bool"
            },
            {
              "name": "winner",
              "type": {
                "option": "publicKey"
              }
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "PlayerAlreadyInGame",
        "msg": "Player already in Game."
      },
      {
        "code": 6001,
        "name": "GameIsFull",
        "msg": "Game is full."
      },
      {
        "code": 6002,
        "name": "WrongTurn",
        "msg": "Not player's turn."
      },
      {
        "code": 6003,
        "name": "NotCreator",
        "msg": "You are not the creator of the chest."
      },
      {
        "code": 6004,
        "name": "InvalidMove",
        "msg": "Invalid move."
      },
      {
        "code": 6005,
        "name": "NotWinner",
        "msg": "You are not the winner"
      },
      {
        "code": 6006,
        "name": "GameIsNotOver",
        "msg": "Game is not over."
      },
      {
        "code": 6007,
        "name": "GameIsOver",
        "msg": "Game is over."
      }
    ],
    "metadata": {
      "address": "7bp83FtVLDPGsk2vMftjHUeyNYE7LKGFJJFh2iLE36br"
    }
  }
  
  export const IDL: BattleshipContract = {
    "version": "0.1.0",
    "name": "battleship_contract",
    "instructions": [
      {
        "name": "initializeGameData",
        "accounts": [
          {
            "name": "gameDataAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "entryFee",
            "type": "u64"
          }
        ]
      },
      {
        "name": "playerJoinsGame",
        "accounts": [
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "choosePlacement",
        "accounts": [
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "selectedSquares",
            "type": {
              "array": [
                {
                  "array": [
                    "u8",
                    10
                  ]
                },
                5
              ]
            }
          }
        ]
      },
      {
        "name": "makeMove",
        "accounts": [
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "selectedSquare",
            "type": {
              "array": [
                "u8",
                2
              ]
            }
          }
        ]
      },
      {
        "name": "withdrawLoot",
        "accounts": [
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "closeAccount",
        "accounts": [
          {
            "name": "gameDataAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "chestVaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "GameDataAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "allCreators",
              "type": {
                "vec": "publicKey"
              }
            }
          ]
        }
      },
      {
        "name": "ChestVaultAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "chestReward",
              "type": "u64"
            },
            {
              "name": "password",
              "type": "string"
            },
            {
              "name": "entryFee",
              "type": "u64"
            },
            {
              "name": "scoreSheet",
              "type": {
                "defined": "GameRecord"
              }
            },
            {
              "name": "gameBoard",
              "type": {
                "array": [
                  {
                    "array": [
                      "u8",
                      10
                    ]
                  },
                  10
                ]
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "GameRecord",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "playerOne",
              "type": "publicKey"
            },
            {
              "name": "playerOneScore",
              "type": "u8"
            },
            {
              "name": "playerTwo",
              "type": "publicKey"
            },
            {
              "name": "playerTwoScore",
              "type": "u8"
            },
            {
              "name": "currentMove",
              "type": "publicKey"
            },
            {
              "name": "gameOver",
              "type": "bool"
            },
            {
              "name": "winner",
              "type": {
                "option": "publicKey"
              }
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "PlayerAlreadyInGame",
        "msg": "Player already in Game."
      },
      {
        "code": 6001,
        "name": "GameIsFull",
        "msg": "Game is full."
      },
      {
        "code": 6002,
        "name": "WrongTurn",
        "msg": "Not player's turn."
      },
      {
        "code": 6003,
        "name": "NotCreator",
        "msg": "You are not the creator of the chest."
      },
      {
        "code": 6004,
        "name": "InvalidMove",
        "msg": "Invalid move."
      },
      {
        "code": 6005,
        "name": "NotWinner",
        "msg": "You are not the winner"
      },
      {
        "code": 6006,
        "name": "GameIsNotOver",
        "msg": "Game is not over."
      },
      {
        "code": 6007,
        "name": "GameIsOver",
        "msg": "Game is over."
      }
    ],
    "metadata": {
      "address": "7bp83FtVLDPGsk2vMftjHUeyNYE7LKGFJJFh2iLE36br"
    }
  }
  