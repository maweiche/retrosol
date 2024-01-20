'use client'
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
require('@solana/wallet-adapter-react-ui/styles.css');



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
    // basic states
    const [loading, setLoading] = useState<boolean>(false);
    const [hookedGame, setHookedGame] = useState<boolean>(false);
    const [showCreateGame, setShowCreateGame] = useState<boolean>(false);

    // game board states
    const [selectedSquareToAttack, setSelectedSquareToAttack] = useState<Array<number> | null>(null); 

    // program states
    const [programId, setProgramId] = useState<PublicKey | null>(null);
    const [gameDataAccount, setGameDataAccount] = useState<PublicKey | null>(null);
    const [chestVaultAccountFetched, setChestVaultAccountFetched] = useState<PublicKey | null>(null);
    const [allCreators, setAllCreators] = useState<Array<any> | null>(null);
    const [selectedCreator, setSelectedCreator] = useState<String | null>(null);
    const [entryFee, setEntryFee] = useState<string | null>(null);
    const [gameState, setGameState] = useState<Array<Array<number>> | null>(null);
    const [winner, setWinner] = useState<string | null>(null);


    // game logic
    const [playerOne, setPlayerOne] = useState<PublicKey | null>(null);
    const [playerTwo, setPlayerTwo] = useState<PublicKey | null>(null);
    const [playerTurn, setPlayerTurn] = useState<PublicKey | null>(null);
    const [gameOver, setGameOver] = useState<boolean>(false);

    const sample_board =
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 0
        [1, 0, 0, 0, 0, 0, 3, 0, 0, 4], // row 1
        [1, 0, 0, 0, 0, 0, 3, 0, 0, 4], // row 2
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 4], // row 3
        [0, 2, 2, 2, 2, 2, 0, 0, 0, 0], // row 4
    ////////////////////////////////////////////////
        [0, 0, 0, 0, 2, 0, 4, 4, 4, 0], // row 5
        [0, 0, 0, 0, 2, 0, 0, 0, 0, 0], // row 6
        [0, 3, 3, 0, 2, 0, 0, 0, 0, 0], // row 7
        [7, 0, 0, 0, 2, 0, 0, 0, 0, 0], // row 8
        [8, 1, 1, 0, 2, 0, 0, 0, 0, 0], // row 9
    ];

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
        9: "J"
    }

    // PROGRAM FUNCTIONS

    // Get data from the global game data account
    async function handleClickGetData() {
        setLoading(true);
        console.log("program", program.programId.toString());
        let data = PublicKey.findProgramAddressSync(
          [Buffer.from("battleshipData")],
          program.programId,
        );
        // console.log("data", data);
        setGameDataAccount(data[0]);
    
        const game_account_info = await connection.getAccountInfo(data[0]);
    
        if (game_account_info != null) {
          const game_data_decoded = program.coder.accounts.decode(
            "GameDataAccount",
            game_account_info?.data,
          );
    
          console.log("game_data_decoded", game_data_decoded);
    
          console.log("creator list", game_data_decoded?.allCreators);
          setAllCreators(
            game_data_decoded?.allCreators.map((creator: { toString: () => any; }) => {
              return creator.toString();
            }),
          );
          setGameDataAccount(game_data_decoded);
          console.log("game_data_decoded", game_data_decoded.allCreators[0].toString());
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
            console.log(treasure_account_info);

            if (treasure_account_info != null) {
                const decoded = program.coder.accounts.decode(
                    "ChestVaultAccount",
                    treasure_account_info?.data,
                );

                console.log("entry fee", decoded.entryFee.toString());
                console.log("player one", decoded.scoreSheet.playerOne.toString());
                console.log("player two", decoded.scoreSheet.playerTwo.toString());
                console.log("player turn", decoded.scoreSheet.currentMove.toString());
                console.log("game over", decoded.scoreSheet.gameOver);
                console.log("winner", decoded.scoreSheet.winner.toString());
                console.log("game board", decoded.gameBoard);
                
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

    // Create ChestVaultAccount/Game
    async function initializeNewGame(entry_fee: string) {
        const entry_fee_as_bn = new anchor.BN(
            // parse entryFee as a float and convert to lamports
            parseFloat(entry_fee) * anchor.web3.LAMPORTS_PER_SOL,
        );
        const newChestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("chestVault"), publicKey?.toBuffer() as any],
            program.programId
        );
        console.log("chest vault account", newChestVaultAccount[0].toString());
        console.log("entry fee", entry_fee_as_bn.toString());
        const transaction = await program.methods
            .initializeGameData(
                entry_fee_as_bn
            )
            .accounts({
                gameDataAccount: globalLevel1GameDataAccount as PublicKey,
                chestVaultAccount: newChestVaultAccount[0] as PublicKey,
                signer: publicKey as PublicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .transaction();

        const txHash = await sendTransaction(transaction, connection);
        
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    
        await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature: txHash,
        });

        handleClickGetData();
    }

    // Join existing ChestVaultAccount/Game

    async function playerJoinsGame() {
        const creator_pubkey = new PublicKey(selectedCreator);
        const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
            program.programId
        );
        console.log("chest vault account", chestVaultAccount[0].toString());
        const transaction = await program.methods
            .playerJoinsGame()
            .accounts({
                chestVaultAccount: chestVaultAccount[0] as PublicKey,
                signer: publicKey as PublicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .transaction();

        const txHash = await sendTransaction(transaction, connection);
        
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    
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
            program.programId
        );

        const transaction = await program.methods
            .choosePlacement(
                //TODO: pass in the game board
                sample_board
            )
            .accounts({
            chestVaultAccount: chestVaultAccount[0],
            signer: publicKey as PublicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            })
            .transaction();

        const txHash = await sendTransaction(transaction, connection);
        
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    
        await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature: txHash,
        });
    }

    // Attack Square
    async function attackSquare(square: Array<number>) {
        const creator_pubkey = new PublicKey(selectedCreator);
        const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
            program.programId
        );

        const transaction = await program.methods
            .makeMove(
                selectedSquareToAttack
            )
            .accounts({
            chestVaultAccount: chestVaultAccount[0],
            signer: publicKey as PublicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            })
            .transaction();

        const txHash = await sendTransaction(transaction, connection);
        
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    
        await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature: txHash,
        });
    }

    // Withdraw winnings
    async function withdrawWinngs() {
        const creator_pubkey = new PublicKey(selectedCreator);
        const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
            program.programId
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

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature: txHash,
        });
    }

    // Close ChestVaultAccount
    async function closeTreasureAccount() {
        const creator_pubkey = new PublicKey(selectedCreator);
        const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
            program.programId
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

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature: txHash,
        });
    }

    // Game functions
    async function handleClickSelectCreator(creator: string) {
        console.log("selecting creator", creator);
        setSelectedCreator(creator);
    }

    // Game Renders
    const renderCreatorSelection = () => {
        return (
          <div>
            {allCreators?.length > 0 && (
              <div
                className='flex flex-col justify-center items-center space-y-2 border-2 border-white p-6'
              >
                <p>Select a creator</p>
                <select
                  className='text-black'
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
            <div
                className="flex flex-col items-center justify-center gap-4"
            >
                
                <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        setShowCreateGame(!showCreateGame);
                    }}
                >
                    {
                        showCreateGame ? "Cancel" : "Create Game"
                    }
                </button>
                   
        
                {showCreateGame && (
                    <div
                        className="flex flex-col items-center justify-center gap-4"
                    >
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
        )
    }

    const renderGameBoard = () => {
        return (
            <div
                className="flex flex-col items-center justify-center gap-4"
            >
                <p>
                    {
                        // if the player one is null, display nothing, else display the player one
                        !playerOne ? "" : "Player One: " + playerOne.toString().slice(0, 4) + "..." + playerOne.toString().slice(-4)
                    }
                    { playerOne && playerTwo ? " vs " : ""}
                    {
                        // if the player two is null, display nothing, else display the player two
                        !playerTwo ? "" : "Player Two: " + playerTwo.toString().slice(0, 4) + "..." + playerTwo.toString().slice(-4)
                    }
                </p>
                <p>
                    {
                        // if the player turn is null, display nothing, else display the player turn
                        !playerTurn ? "" : "Player Turn: " + playerTurn.toString().slice(0, 4) + "..." + playerTurn.toString().slice(-4)
                    }
                </p>
                <div
                    // display a 10x10 grid of squares with borders, size should be 12px x 12px
                    className="grid grid-cols-10 gap-0"
                >
                    {/* for each square, display a div with a border */}
                    {
                        sample_board.slice(0,5).map((row, i) => (
                            row.map((square, j) => (
                                <div
                                    key={i * 10 + j}
                                    className="border-2 border-white h-12 w-12 text-center font-bold text-2xl text-white py-2"
                                    style={{
                                        backgroundColor: square === 8 ? "green": square === 9 ? "green" : square === 1 ? "green" : square === 2 ? "green" : square === 3 ? "green" : square === 4 ? "green" : "blue",
                                        // if the selected square to attack is the current square, display a red border
                                        border: selectedSquareToAttack && selectedSquareToAttack[0] === i && selectedSquareToAttack[1] === j && "2px solid red",
                                    }}
                                    onClick={() => {
                                        if (square !== 7 && square !== 8 && square !== 9) {
                                            setSelectedSquareToAttack([i, j]);
                                            // console log the square that was clicked [row, col]
                                            console.log([i, j]);
                                        }
                                    }}
                                >
                                    {
                                        square === 0 ? "" : square === 7 ? "O" : square === 8 || square === 9 ? "X" : ""
                                    }
                                    {
                                        // if the selected square to attack is the current square, display the row letter from row_map and the column number
                                        !selectedSquareToAttack ? "" : selectedSquareToAttack[0] === i && selectedSquareToAttack[1] === j ?
                                        row_map[i] + (j + 1) : ""
                                    }
                                </div>
                            ))
                        ))
                    }
                </div>
                {/* display a horizontal divider line to seperate the 2 sides of the board */}
                <div className="border-2 border-white h-6 w-full bg-orange-500"></div>
                <div
                    // display a 10x10 grid of squares with borders, size should be 12px x 12px
                    className="grid grid-cols-10 gap-0"
                >
                    {/* for each square, display a div with a border */}
                    {
                        sample_board.slice(-5).map((row, i) => (
                            row.map((square, j) => (
                                <div
                                    key={i * 10 + j}
                                    className="border-2 border-white h-12 w-12 text-center font-bold text-2xl text-white py-2"
                                    style={{
                                        backgroundColor: square === 8 ? "green": square === 9 ? "green" : square === 1 ? "green" : square === 2 ? "green" : square === 3 ? "green" : square === 4 ? "green" : "blue",
                                        border: selectedSquareToAttack && selectedSquareToAttack[0] === i + 5 && selectedSquareToAttack[1] === j && "2px solid red",
                                    }}
                                    onClick={() => {
                                        // if the square isn't a 8, 8, or 9, set the selected square to attack to the current square
                                        if (square !== 7 && square !== 8 && square !== 9) {
                                            setSelectedSquareToAttack([i + 5, j]);
                                            // console log the square that was clicked [row, col]
                                            console.log([i + 5, j]);
                                        }
                                    }}
                                    
                                >
                                    {
                                        //if the square is a 0, display nothing, if it is a 7 display O, if it is a 8/9 display X, else display nothing
                                        square === 0 ? "" : square === 7 ? "O" : square === 8 || square === 9 ? "X" : ""
                                    }
                                    {
                                        // if the selected square to attack is the current square, display the row letter from row_map and the column number
                                        !selectedSquareToAttack ? "" : selectedSquareToAttack[0] === i + 5 && selectedSquareToAttack[1] === j ?
                                        row_map[i + 5] + (j + 1) : ""
                                    }
                                </div>
                            ))
                        ))
                    }
                </div>
                <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        // if the selected square to attack is not null, attack the square
                        if (selectedSquareToAttack) {
                            // attackSquare(selectedSquareToAttack);
                        }
                    }}
                >
                    Attack
                </button>
            </div>
        )
    }

    useEffect(() => {
        if(!gameDataAccount) {
            handleClickGetData();
        }
    });
  
    return (
        <div
            className="flex flex-col items-center justify-center gap-4"
        >
            {gameState && renderGameBoard()}
            {!gameState && renderCreateGame()}
            {!showCreateGame && allCreators?.length > 0 && renderCreatorSelection()}
        </div>
    );
};

export default Game;
