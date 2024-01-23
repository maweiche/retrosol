"use client";
import React, { useDebugValue } from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  program,
  connection,
  globalLevel1GameDataAccount,
} from "../utils/anchor";
import * as anchor from "@project-serum/anchor";
import { notify } from "../../../utils/notifications";
import { set } from "date-fns";
import { pl } from "date-fns/locale";
require("@solana/wallet-adapter-react-ui/styles.css");

type GameDataAccount = {
  all_creators: Array<PublicKey>;
};

type ChestVaultAccount = {
  authority: PublicKey;
  chest_reward: number;
  password: String;
  max_attempts_left: number;
  entry_fee: number;
  players: Array<PublicKey>;
};

const Game = () => {
  const { publicKey, sendTransaction } = useWallet();
  const default_publicKey = "11111111111111111111111111111111";
  // basic states
  const [loading, setLoading] = useState<boolean>(false);
  const [hookedGame, setHookedGame] = useState<boolean>(false);
  const [showCreateGame, setShowCreateGame] = useState<boolean>(false);

  // game board states
  const [selectedSquareToAttack, setSelectedSquareToAttack] =
    useState<Array<number> | null>(null);

  // program states
  const [programId, setProgramId] = useState<PublicKey | null>(null);
  const [gameDataAccount, setGameDataAccount] = useState<PublicKey | null>(
    null,
  );
  const [chestVaultAccountFetched, setChestVaultAccountFetched] =
    useState<PublicKey | null>(null);
  const [allCreators, setAllCreators] = useState<Array<any> | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<String | null>(null);
  const [entryFee, setEntryFee] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  // game logic
  const [playerOne, setPlayerOne] = useState<PublicKey | null>(null);
  const [playerTwo, setPlayerTwo] = useState<PublicKey | null>(null);
  const [playerTurn, setPlayerTurn] = useState<PublicKey | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameState, setGameState] = useState<Array<Array<number>> | null>(null);
  const [playerOneReady, setPlayerOneReady] = useState<boolean>(false);
  const [playerTwoReady, setPlayerTwoReady] = useState<boolean>(false);
  const sample_board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 1
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 2
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 3
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 4
    ////////////////////////////////////////////////
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 5
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 6
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 7
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 8
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 9
  ];
  const [placedShips, setPlacedShips] = useState<Array<Array<number>> | null>(
    sample_board,
  );
  const [placementTotal, setPlacementTotal] = useState<number>(0);
  const [placementValid, setPlacementValid] = useState<boolean>(true);

  const row_map = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
    5: "F",
    6: "G",
    7: "H",
    8: "I",
    9: "J",
  };

  // PROGRAM FUNCTIONS

  // Get data from the global game data account
  async function handleClickGetData() {
    setLoading(true);
    let data = PublicKey.findProgramAddressSync(
      [Buffer.from("battleshipData")],
      program.programId,
    );
    setGameDataAccount(data[0]);

    const game_account_info = await connection.getAccountInfo(data[0]);

    if (game_account_info != null) {
      const game_data_decoded = program.coder.accounts.decode(
        "GameDataAccount",
        game_account_info?.data,
      );
      setAllCreators(
        game_data_decoded?.allCreators.map(
          (creator: { toString: () => any }) => {
            return creator.toString();
          },
        ),
      );
      setGameDataAccount(game_data_decoded!);
    }
  }

  // Get Data from the selected ChestVaultAccount
  async function getGameState() {
    if (selectedCreator) {
      setLoading(true);
      const creator_key = new PublicKey(selectedCreator);
      const treasure = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("chestVault"), creator_key.toBuffer()],
        program.programId,
      );

      setChestVaultAccountFetched(treasure[0]);

      const treasure_account_info = await connection.getAccountInfo(
        treasure[0],
      );

      if (treasure_account_info != null) {
        const decoded = program.coder.accounts.decode(
          "ChestVaultAccount",
          treasure_account_info?.data,
        );

        setEntryFee(decoded.entryFee.toString());
        setPlayerOne(decoded.scoreSheet.playerOne.toString());
        setPlayerTwo(decoded.scoreSheet.playerTwo.toString());
        setPlayerTurn(decoded.scoreSheet.currentMove.toString());
        setGameOver(decoded.scoreSheet.gameOver);
        setWinner(decoded.scoreSheet.winner?.toString());
        setGameState(decoded.gameBoard);
        let player_one_ships = 0;
        // iterate through rows 0-4 the game board and check if all the ships have been placed
        // do so by incrementing player_one_ships by 1 for each non-0 square
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 10; j++) {
            if (decoded.gameBoard[i][j] !== 0) {
              player_one_ships += 1;
            }
          }
        }
        // if all the ships have been placed, set player one ready to true
        if (player_one_ships >= 14) {
          setPlayerOneReady(true);
        }

        let player_two_ships = 0;
        // iterate through rows 5-9 the game board and check if all the ships have been placed
        // do so by incrementing player_two_ships by 1 for each non-0 square
        for (let i = 5; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            if (decoded.gameBoard[i][j] !== 0) {
              player_two_ships += 1;
            }
          }
        }

        // if all the ships have been placed, set player two ready to true
        if (player_two_ships >= 14) {
          setPlayerTwoReady(true);
        }
      }
      setLoading(false);
    }
  }

  // Create ChestVaultAccount/Game
  async function initializeNewGame(entry_fee: string) {
    const entry_fee_as_bn = new anchor.BN(
      // parse entryFee as a float and convert to lamports
      parseFloat(entry_fee) * anchor.web3.LAMPORTS_PER_SOL,
    );
    const newChestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault"), publicKey?.toBuffer() as any],
      program.programId,
    );

    const transaction = await program.methods
      .initializeGameData(entry_fee_as_bn)
      .accounts({
        gameDataAccount: globalLevel1GameDataAccount as PublicKey,
        chestVaultAccount: newChestVaultAccount[0] as PublicKey,
        signer: publicKey as PublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();

    const txHash = await sendTransaction(transaction, connection);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: txHash,
    });

    setShowCreateGame(false);

    handleClickGetData();
  }

  // Join existing ChestVaultAccount/Game

  async function playerJoinsGame() {
    const creator_pubkey = new PublicKey(selectedCreator);
    const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
      program.programId,
    );
    const transaction = await program.methods
      .playerJoinsGame()
      .accounts({
        chestVaultAccount: chestVaultAccount[0] as PublicKey,
        signer: publicKey as PublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();

    const txHash = await sendTransaction(transaction, connection);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: txHash,
    });

    setHookedGame(true);
    await getGameState();
  }

  // Set Game Board
  async function playerSetsGameBoard() {
    const creator_pubkey = new PublicKey(selectedCreator);
    const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
      program.programId,
    );

    const transaction = await program.methods
      .choosePlacement(
        //TODO: pass in the game board
        placedShips as Array<Array<number>>,
      )
      .accounts({
        chestVaultAccount: chestVaultAccount[0],
        signer: publicKey as PublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();

    const txHash = await sendTransaction(transaction, connection);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: txHash,
    });

    await getGameState();
  }

  // Attack Square
  async function attackSquare(square: Array<number>) {
    const creator_pubkey = new PublicKey(selectedCreator);
    const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
      program.programId,
    );

    const transaction = await program.methods
      .makeMove(selectedSquareToAttack)
      .accounts({
        chestVaultAccount: chestVaultAccount[0],
        signer: publicKey as PublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();

    const txHash = await sendTransaction(transaction, connection);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: txHash,
    });

    setSelectedSquareToAttack(null);
  }

  // Withdraw winnings
  async function withdrawWinngs() {
    const creator_pubkey = new PublicKey(selectedCreator);
    const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
      program.programId,
    );

    const transaction = await program.methods
      .withdrawLoot()
      .accounts({
        chestVaultAccount: chestVaultAccount[0],
        signer: publicKey as PublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();

    const txHash = await sendTransaction(transaction, connection);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: txHash,
    });
  }

  // Close ChestVaultAccount
  async function closeTreasureAccount() {
    const [gameDataAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("battleshipData")],
      program.programId,
    );
    const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault"), publicKey?.toBuffer() as any],
      program.programId,
    );
    const transaction = await program.methods
      .closeAccount()
      .accounts({
        gameDataAccount: gameDataAccount,
        chestVaultAccount: chestVaultAccount[0],
        signer: publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();

    const txHash = await sendTransaction(transaction, connection);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: txHash,
    });
  }

  // Game functions
  async function handleClickSelectCreator(creator: string) {
    setSelectedCreator(creator);
  }

  async function checkPlacementTotal() {
    let total = 0;
    // if(playerOne.toString() == publicKey.toString()){
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        if (placedShips[i][j] !== 0) {
          total += 1;
        }
      }
    }
  
    if (total == 14) {
      if (playerOne.toString() == publicKey.toString()) {
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 10; j++) {
            if (placedShips[i][j] == 1) {
              if (
                placedShips[i][j + 1] !== 1 &&
                placedShips[i][j - 1] !== 1 &&
                placedShips[i + 1][j] !== 1 &&
                placedShips[i - 1][j] !== 1
              ) {
                notify({
                  message: "Ships must be placed horizontally or vertically!",
                  type: "error",
                });
                setPlacementValid(false);
                return 0;
              }
            }
          }
        }
      } else if (playerTwo.toString() == publicKey.toString()) {
        for (let i = 5; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            if (placedShips[i][j] == 1) {
              if (
                placedShips[i][j + 1] !== 1 &&
                placedShips[i][j - 1] !== 1 &&
                placedShips[i + 1][j] !== 1 &&
                placedShips[i - 1][j] !== 1
              ) {
                notify({
                  message: "Ships must be placed horizontally or vertically!",
                  type: "error",
                });
                setPlacementValid(false);
                return 0;
              }
            }
          }
        }
      }
    }

    if (total == 14) {
      notify({
        message: "All ships placed!",
        type: "success",
      });
    }
    return total;
  }

  // Game Renders
  const renderCreatorSelection = () => {
    return (
      <div>
        {allCreators?.length > 0 && (
          <div className="flex flex-col justify-center items-center space-y-2 border-2 border-white p-6">
            <p>Select a creator</p>
            <select
              className="text-black"
              value={selectedCreator?.toString()}
              onChange={(e) => handleClickSelectCreator(e.target.value)}
            >
              <option value={null}>Select a creator</option>
              {allCreators.map((creator: string, index: number) => {
                return (
                  <option key={index} value={creator?.toString()}>
                    {creator?.toString()}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    );
  };

  const renderCreateGame = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setShowCreateGame(!showCreateGame);
          }}
        >
          {showCreateGame ? "Cancel" : "Create Game"}
        </button>

        {showCreateGame && (
          <div className="flex flex-col items-center justify-center gap-4">
            <input
              className="text-black align-middle text-center"
              onChange={(e) => {
                setEntryFee(e.target.value);
              }}
              placeholder="Entry Fee"
            />
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                initializeNewGame(entryFee as string);
              }}
            >
              Create Game
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderJoinGame = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>Join Game</p>
        <p>Entry Fee: {parseInt(entryFee) / LAMPORTS_PER_SOL}</p>
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            playerJoinsGame();
          }}
        >
          Join Game
        </button>
      </div>
    );
  };

  const renderShipPlacement = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>Place Your Ships</p>
        <p>Ship Units: {placementTotal}/14</p>
        <p>⛴️ : 5 | 🚢 : 4 | 🛥️ : 3 | 🛶 : 2 |</p>
        <div
          // display a 10x10 grid of squares with borders, size should be 12px x 12px
          className="grid grid-cols-10 gap-0"
        >
          {/* for each square, display a div with a border */}
          {placedShips?.slice(0, 5).map((row, i) =>
            row.map((square, j) => (
              <div
                key={i * 10 + j}
                className="border-2 border-white h-12 w-12 text-center font-bold text-2xl text-white py-2 cursor-pointer"
                style={{
                  backgroundColor:
                    placedShips[i][j] || placedShips[i + 5][j] == 1
                      ? "green"
                      : "blue",
                }}
                onClick={() => {
                  let newPlacedShips = [...placedShips];

                  if (publicKey.toString() == playerOne.toString()) {
                    // change the square to a 1 in the placedShips array
                    if (newPlacedShips[i][j] === 1) {
                      newPlacedShips[i][j] = 0;
                    } else {
                      if (placementTotal < 14) {
                        newPlacedShips[i][j] = 1;
                      }
                    }
                  } else if (
                    publicKey.toString() == playerTwo.toString() &&
                    placementTotal <= 14
                  ) {
                    //Player 2
                    if (newPlacedShips[i][j] === 1) {
                      newPlacedShips[i][j] = 0;
                    } else {
                      if (placementTotal < 14) {
                        newPlacedShips[i][j] = 1;
                      }
                    }
                  }
                  setPlacedShips(newPlacedShips);
                }}
                aria-disabled={placementTotal >= 14}
              >
                {playerOne.toString() == publicKey.toString()
                  ? row_map[i] + (j + 1)
                  : row_map[i + 5] + (j + 1)}
              </div>
            )),
          )}
        </div>

        {placementTotal == 14 && placementValid && (
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              playerSetsGameBoard();
            }}
          >
            Submit
          </button>
        )}
      </div>
    );
  };

  const renderGameBoard = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>
          {
            // if the player one is null, display nothing, else display the player one
            !playerOne
              ? ""
              : "Player One: " +
                playerOne.toString().slice(0, 4) +
                "..." +
                playerOne.toString().slice(-4)
          }
        </p>
        <p>{playerOne && playerTwo ? " vs " : ""}</p>
        <p>
          {
            // if the player two is null, display nothing, else display the player two
            !playerTwo
              ? ""
              : "Player Two: " +
                playerTwo.toString().slice(0, 4) +
                "..." +
                playerTwo.toString().slice(-4)
          }
        </p>
        <p>
          {playerTurn && playerOne && playerTwo
            ? "Current Turn: " +
              (playerTurn.toString() == playerOne.toString()
                ? "Player One"
                : "Player Two")
            : ""}
        </p>
        <div
          className="grid grid-cols-10 gap-0"
        >
          {gameState?.slice(0, 5).map((row, i) =>
            row.map((square, j) => (
              <div
                key={i * 10 + j}
                className="border-2 border-white h-12 w-12 text-center font-bold text-2xl text-white py-2"
                style={{
                  backgroundColor:
                    square === 8
                      ? "green"
                      : playerOne.toString() == publicKey.toString() &&
                          square === 9
                        ? "green"
                        : playerOne.toString() == publicKey.toString() &&
                            square === 1
                          ? "green"
                          : "blue",
                  border:
                    selectedSquareToAttack &&
                    selectedSquareToAttack[0] === i &&
                    selectedSquareToAttack[1] === j &&
                    "2px solid red",
                }}
                onClick={() => {
                  if (
                    square !== 7 &&
                    square !== 8 &&
                    square !== 9 &&
                    playerTwo.toString() == publicKey.toString() &&
                    playerTurn.toString() == publicKey.toString()
                  ) {
                    setSelectedSquareToAttack([i, j]);
                  }
                }}
              >
                {square === 0
                  ? ""
                  : square === 7
                    ? "O"
                    : square === 8 || square === 9
                      ? "X"
                      : ""}
                {
                  !selectedSquareToAttack
                    ? ""
                    : selectedSquareToAttack[0] === i &&
                        selectedSquareToAttack[1] === j
                      ? row_map[i] + (j + 1)
                      : ""
                }
              </div>
            )),
          )}
        </div>
        <div className="border-2 border-white h-6 w-full bg-orange-500"></div>
        <div className="grid grid-cols-10 gap-0">
          {gameState?.slice(-5).map((row, i) =>
            row.map((square, j) => (
              <div
                key={i * 10 + j}
                className="border-2 border-white h-12 w-12 text-center font-bold text-2xl text-white py-2"
                style={{
                  backgroundColor:
                    playerTwo.toString() == publicKey.toString() && square === 8
                      ? "green"
                      : square === 9
                        ? "green"
                        : playerTwo.toString() == publicKey.toString() &&
                            square === 1
                          ? "green"
                          : "blue",
                  border:
                    selectedSquareToAttack &&
                    selectedSquareToAttack[0] === i + 5 &&
                    selectedSquareToAttack[1] === j &&
                    "2px solid red",
                }}
                onClick={() => {
                  if (
                    square !== 7 &&
                    square !== 8 &&
                    square !== 9 &&
                    playerOne.toString() == publicKey.toString() &&
                    playerTurn.toString() == publicKey.toString()
                  ) {
                    setSelectedSquareToAttack([i + 5, j]);
                  }
                }}
              >
                {
                  square === 0
                    ? ""
                    : square === 7
                      ? "O"
                      : square === 8 || square === 9
                        ? "X"
                        : ""
                }
                {
                  !selectedSquareToAttack
                    ? ""
                    : selectedSquareToAttack[0] === i + 5 &&
                        selectedSquareToAttack[1] === j
                      ? row_map[i + 5] + (j + 1)
                      : ""
                }
              </div>
            )),
          )}
        </div>
        <h2>
          Pieces Hit:{" "}
          {playerOne.toString() == publicKey.toString()
            ? gameState?.flat().filter((square) => square === 9).length
            : gameState?.flat().filter((square) => square === 8).length}{" "}
          / 14
        </h2>
        {!gameOver && (
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              if (selectedSquareToAttack) {
                attackSquare(selectedSquareToAttack);
              }
            }}
            disabled={
              !selectedSquareToAttack ||
              gameOver ||
              playerTurn.toString() !== publicKey?.toString() ||
              !playerOneReady ||
              !playerTwoReady
            }
          >
            Attack!
          </button>
        )}
      </div>
    );
  };

  const renderGameOver = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        {publicKey.toString() == winner ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <p>You won!</p>
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                withdrawWinngs();
              }}
            >
              Withdraw Winnings
            </button>
          </div>
        ) : (
          <p>You lost!</p>
        )}
        {publicKey.toString() == playerOne.toString() && (
          <div className="flex flex-col items-center justify-center gap-4">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                closeTreasureAccount();
              }}
            >
              Close Game and Withdraw Rent
            </button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (publicKey && gameState) {
      checkPlacementTotal().then((total) => {
        setPlacementTotal(total);
      });
    }
  }, [placedShips]);

  useEffect(() => {
    if (selectedCreator) {
      getGameState();
    }
  }, [selectedCreator]);

  useEffect(() => {
    if (!gameDataAccount) {
      handleClickGetData();
    }
  });

  useEffect(() => {
    if (!chestVaultAccountFetched) return;
    const subscriptionId = connection.onAccountChange(
      chestVaultAccountFetched as PublicKey,
      (accountInfo) => {
        const decoded = program.coder.accounts.decode(
          "ChestVaultAccount",
          accountInfo.data,
        );
        setGameState(decoded.gameBoard);
        setWinner(
          decoded.scoreSheet.winner?.toString() !=
            "11111111111111111111111111111111"
            ? decoded.scoreSheet.winner?.toString()
            : "No Winner Yet",
        );
        setGameOver(decoded.scoreSheet.gameOver);
        setPlayerTurn(decoded.scoreSheet.currentMove?.toString());
      },
    );

    if (gameOver && winner != "11111111111111111111111111111111") {
      notify({
        message: `Game Over! Winner is ${winner.slice(0, 4)}...${winner.slice(-4)}`,
        type: "success",
      });
      return () => {
        connection.removeAccountChangeListener(subscriptionId);
      };
    }
  }, [chestVaultAccountFetched, gameOver, winner]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {publicKey &&
        !showCreateGame &&
        allCreators?.length > 0 &&
        renderCreatorSelection()}
      {publicKey &&
        gameState &&
        playerOne.toString() == publicKey.toString() &&
        playerOneReady &&
        renderGameBoard()}
      {publicKey &&
        gameState &&
        playerTwo.toString() == publicKey.toString() &&
        playerTwoReady &&
        renderGameBoard()}
      {publicKey && !gameState && renderCreateGame()}
      {publicKey &&
        gameState &&
        playerOne.toString() != publicKey.toString() &&
        playerTwo.toString() == default_publicKey &&
        renderJoinGame()}
      {publicKey &&
        !showCreateGame &&
        selectedCreator &&
        gameState &&
        playerOne.toString() == publicKey.toString() &&
        !playerOneReady &&
        renderShipPlacement()}
      {publicKey &&
        !showCreateGame &&
        selectedCreator &&
        gameState &&
        playerTwo.toString() == publicKey.toString() &&
        !playerTwoReady &&
        renderShipPlacement()}
      {publicKey && gameState && gameOver && renderGameOver()}
    </div>
  );
};

export default Game;
