/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useDebugValue } from "react";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import Mancala_Rules from "components/rules/mancala_rules";
import {
  program,
  connection,
  globalLevel1GameDataAccount,
} from "../utils/anchor";
import * as anchor from "@project-serum/anchor";
import { notify } from "../../../utils/notifications";

const Game = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [gameDataAccount, setGameDataAccount] = useState<PublicKey>();
  const [gameState, setGameState] = useState([]);

  const [listOfCreators, setListOfCreators] = useState<Array<any> | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<String>();
  const [chestVaultAccountFetched, setChestVaultAccountFetched] =
    useState<PublicKey>();
  const [hookedGame, setHookedGame] = useState<boolean>(false);

  const [entryFee, setEntryFee] = useState(0);
  const [playerTurn, setPlayerTurn] = useState("");
  const [selectedPit, setSelectedPit] = useState(-1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const [playerOne, setPlayerOne] = useState("");
  const [playerTwo, setPlayerTwo] = useState("");

  const programId = anchor.web3.SystemProgram.programId;

  async function handleClickGetData() {
    setLoading(true);
    let data = PublicKey.findProgramAddressSync(
      [Buffer.from("mancalaData")],
      program.programId,
    );
    setGameDataAccount(data[0]);

    const game_account_info = await connection.getAccountInfo(data[0]);

    if (game_account_info != null) {
      const game_data_decoded = program.coder.accounts.decode(
        "GameDataAccount",
        game_account_info?.data,
      );
      if(game_data_decoded?.allAuthorities.length == 0) {
        notify({
          message: `No games found`,
          type: "error",
        });
      }
      setListOfCreators(
        game_data_decoded?.allAuthorities.map(
          (creator: { toString: () => any }) => {
            return creator.toString();
          },
        ),
      );
      setGameDataAccount(game_data_decoded);
    }
  }

  async function getGameAccountInfo() {
    const game_account_info = await connection.getAccountInfo(
      globalLevel1GameDataAccount,
    );
  }

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
        setWinner(decoded.scoreSheet.winner.toString());
        setGameState(decoded.gameBoard);
      }
      setLoading(false);
    }
  }

  async function handleClickSelectCreator(creator: string) {
    setSelectedCreator(creator);
  }

  const renderCreatorSelection = () => {
    return (
      <div>
        {listOfCreators?.length > 0 && (
          <div className="flex flex-col justify-center items-center space-y-2 border-2 border-white p-6">
            <p>Select a creator</p>
            <select
              className="text-black"
              value={selectedCreator?.toString()}
              onChange={(e) => handleClickSelectCreator(e.target.value)}
            >
              <option value={null}>Select a creator</option>
              {listOfCreators.map((creator: string, index: number) => {
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

  async function initializeGameData(entry_fee: string) {
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

    getGameAccountInfo();
  }

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

  async function makeMove(selectedPit: number) {
    const creator_pubkey = new PublicKey(selectedCreator);
    const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
      program.programId,
    );
    const transaction = await program.methods
      .makeMove(selectedPit)
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
    setSelectedPit(-1);
    await getGameState();
  }

  async function withdraw() {
    const creator_pubkey = new PublicKey(selectedCreator);
    const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
      program.programId,
    );
    const transaction = await program.methods
      .withdraw()
      .accounts({
        gameDataAccount: globalLevel1GameDataAccount as PublicKey,
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

    await getGameState();
  }

  // async function clearGameList() {
  //   const transaction = await program.methods
  //     .clearGameList()
  //     .accounts({
  //       gameDataAccount: globalLevel1GameDataAccount as PublicKey,
  //       signer: publicKey as PublicKey,
  //     })
  //     .transaction();

  //   const txHash = await sendTransaction(transaction, connection);

  //   const { blockhash, lastValidBlockHeight } =
  //     await connection.getLatestBlockhash();

  //   await connection.confirmTransaction({
  //     blockhash,
  //     lastValidBlockHeight,
  //     signature: txHash,
  //   });
  // }

  const renderGameBoard = () => {
    return (
      <div className="flex flex-col items-center">
        {chestVaultAccountFetched && (
          <div className="flex flex-col items-center">
            {/* convert entryFee to a normal number from big number */}
            <p>
              Entry Fee:{" "}
              {entryFee ? entryFee / anchor.web3.LAMPORTS_PER_SOL : "???"} SOL
            </p>
            <p>
              {playerTurn === publicKey?.toString()
                ? "YOUR TURN"
                : `${playerTurn.slice(0, 4)}...${playerTurn.slice(-4)}`}
            </p>
          </div>
        )}
        <div className="flex flex-row items-center gap-20">
          <p>
            {playerOne.slice(0, 4)}...{playerOne.slice(-4)}
          </p>
          <p>vs.</p>
          <p>
            {playerTwo != "11111111111111111111111111111111"
              ? playerTwo.slice(0, 4) + "..." + playerTwo.slice(-4)
              : "Waiting for player..."}
          </p>
        </div>
        <div className="flex justify-around border-2">
          {" "}
          {/* Score pits */}
          <div className="w-16 h-24 border-2 border-white flex items-center justify-center m-4">
            {gameState[0]} {/* Player 2's score pit */}
          </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-around">
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 13 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerTwo) {
                    setSelectedPit(13);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[13]}
              </div>
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 12 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerTwo) {
                    setSelectedPit(12);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[12]}
              </div>
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 11 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerTwo) {
                    setSelectedPit(11);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[11]}
              </div>
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 10 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerTwo) {
                    setSelectedPit(10);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[10]}
              </div>
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 9 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerTwo) {
                    setSelectedPit(9);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[9]}
              </div>
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 8 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerTwo) {
                    setSelectedPit(8);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[8]}
              </div>
            </div>
            <div className="flex justify-around">
              <div
                key={gameState[1]}
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 1 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerOne) {
                    setSelectedPit(1);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[1]}
              </div>
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 2 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerOne) {
                    setSelectedPit(2);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[2]}
              </div>
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 3 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerOne) {
                    setSelectedPit(3);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[3]}
              </div>
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 4 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerOne) {
                    setSelectedPit(4);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[4]}
              </div>
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 5 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerOne) {
                    setSelectedPit(5);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[5]}
              </div>
              <div
                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                style={{
                  borderColor: 6 === selectedPit ? "#66ff00" : "white",
                }}
                onClick={() => {
                  if (playerTurn === playerOne) {
                    setSelectedPit(6);
                  }
                }}
                // aria-disabled={playerTurn === playerTwo ? false : true}
              >
                {gameState[6]}
              </div>
            </div>
          </div>
          <div className="w-16 h-24 border-2 border-white flex items-center justify-center m-4">
            {gameState[7]} {/* Player 1's score pit */}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!globalLevel1GameDataAccount) return;

    const subscriptionId = connection.onAccountChange(
      globalLevel1GameDataAccount,
      (accountInfo) => {
        const decoded = program.coder.accounts.decode(
          "GameDataAccount",
          accountInfo.data,
        );
        setListOfCreators(
          decoded?.allAuthorities.map((authority: { toString: () => any }) => {
            return authority.toString();
          }),
        );
        setGameDataAccount(decoded);
      },
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, globalLevel1GameDataAccount, program]);

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
          decoded.scoreSheet.winner.toString() !=
            "11111111111111111111111111111111"
            ? decoded.scoreSheet.winner.toString()
            : "No Winner Yet",
        );
        setGameOver(decoded.scoreSheet.gameOver);
        setPlayerTurn(decoded.scoreSheet.currentMove.toString());
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
  }, [chestVaultAccountFetched]);

  useEffect(() => {
    getGameAccountInfo();
  }, []);

  useEffect(() => {
    getGameState();
  }, [selectedCreator]);

  return (
    <div
      className="flex flex-col items-center"
    >
      {chestVaultAccountFetched && (
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setChestVaultAccountFetched(null)}
        >
          Main Menu
        </button>
      )}
      <button
        className="border-2 border-white m-4"
        onClick={() => setShowRules(!showRules)}
      >
        {showRules ? "Hide Rules" : "Show Rules"}
      </button>
      {showRules && <Mancala_Rules />}
      {/* <button
        className="border-2 border-white m-4 align-center"
        onClick={() => clearGameList()}
      >
        Clear Game List
      </button> */}
      {chestVaultAccountFetched && renderGameBoard()}
      <div className="flex flex-col items-center">
        {selectedCreator && (
          <button
            className="border-2 border-white m-4"
            onClick={() => getGameState()}
          >
            Get Game State
          </button>
        )}
        {chestVaultAccountFetched &&
          playerTwo == "11111111111111111111111111111111" && (
            <button
              className="border-2 border-white m-4"
              onClick={() => playerJoinsGame()}
            >
              Join Game
            </button>
          )}
        {chestVaultAccountFetched && playerTurn == publicKey?.toString() && (
          <button
            className="border-2 border-white m-4"
            onClick={() => makeMove(selectedPit)}
          >
            Make Move
          </button>
        )}
        {gameOver && (
          <div className="flex flex-col items-center">
            <p>Game Over!</p>
            <p>
              Winner: {winner.slice(0, 4)}...{winner.slice(-4)}
            </p>
          </div>
        )}
        {winner == publicKey?.toString() && gameOver && (
          <button
            className="border-2 border-white m-4"
            onClick={() => withdraw()}
          >
            Withdraw
          </button>
        )}
      </div>
      {!chestVaultAccountFetched && (
        <div className="flex flex-col items-center">
          {renderCreatorSelection()}
          <button
            className="border-2 border-white m-4"
            onClick={() => handleClickGetData()}
          >
            Check for Games
          </button>
          <button
            className="border-2 border-white m-4"
            onClick={() => initializeGameData(".25")}
          >
            Create Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
