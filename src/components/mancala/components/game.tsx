/* eslint-disable react-hooks/exhaustive-deps */
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
import { set } from "date-fns";
import { get } from "http";

const Game = () => {
    const { publicKey, sendTransaction } = useWallet();
    const [loading, setLoading] = useState(false);
    const [gameDataAccount, setGameDataAccount] = useState<PublicKey>();
    const [gameState, setGameState] = useState(
        [0, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4]
    );

    const [listOfCreators, setListOfCreators] = useState([
        publicKey?.toBase58() as string
    ]);
    const [selectedCreator, setSelectedCreator] = useState<String>();

    const [entryFee, setEntryFee] = useState(0);
    const [playerTurn, setPlayerTurn] = useState(1);
    const [selectedPit, setSelectedPit] = useState(-1);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState('');

    const [playerOne, setPlayerOne] = useState('');
    const [playerTwo, setPlayerTwo] = useState('');

    const programId = anchor.web3.SystemProgram.programId;

    async function handleClickGetData() {
        setLoading(true);
        console.log("program", program.programId.toString());
        let data = PublicKey.findProgramAddressSync(
          [Buffer.from("mancalaData")],
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
    
          console.log("creator list", game_data_decoded?.allAuthorities);
          setListOfCreators(
            game_data_decoded?.allAuthorities.map((creator: { toString: () => any; }) => {
              return creator.toString();
            }),
          );
          setGameDataAccount(game_data_decoded);
          console.log("game_data_decoded", game_data_decoded.allAuthorities[0].toString());
        }
    
    }

    async function getGameAccountInfo() {
        const game_account_info = await connection.getAccountInfo(globalLevel1GameDataAccount);
        console.log(game_account_info);
        // decode the game_account_info and get the listOfCreators
        // setListOfCreators(listOfCreators);

        // const subscriptionId = connection.onAccountChange(
        //     globalLevel1GameDataAccount,
        //     (accountInfo) => {
        //       const decoded = program.coder.accounts.decode(
        //         "GameDataAccount",
        //         accountInfo.data,
        //       );
        //       console.log("creator list", decoded.allCreators);
        //       setListOfCreators(
        //         decoded?.allCreators.map((creator: { toString: () => any; }) => {
        //           return creator.toString();
        //         }),
        //       );
        //       setGameDataAccount(decoded);
        //     }
        // );
    }

    async function getGameState() {
        if (selectedCreator) {
            setLoading(true);
            const creator_key = new PublicKey(selectedCreator);
            const treasure = anchor.web3.PublicKey.findProgramAddressSync(
              [Buffer.from("chestVault"), creator_key.toBuffer()],
              program.programId,
            );

            const treasure_account_info = await connection.getAccountInfo(
                treasure[0],
            );
            console.log(treasure_account_info);

            if (treasure_account_info != null) {
                const decoded = program.coder.accounts.decode(
                    "ChestVaultAccount",
                    treasure_account_info?.data,
                );
                console.log(decoded);

                // pub struct ChestVaultAccount{
                //     pub authority: Pubkey,
                //     pub chest_reward: u64,
                //     pub password: String,
                //     pub entry_fee: u64,
                //     pub score_sheet: GameRecord,
                //     pub game_board: [u8; 14],
                // }

                // pub struct GameRecord {
                //     pub player_one: Pubkey,
                //     pub player_one_score: u8,
                //     pub player_two: Pubkey,
                //     pub player_two_score: u8,
                //     pub total_moves: u8,
                //     pub current_move: Pubkey,
                //     pub game_over: bool,
                //     pub winner: Pubkey,
                // }

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

    async function handleClickSelectCreator(creator: string) {
        console.log("selecting creator", creator);
        setSelectedCreator(creator);
    }

    const renderCreatorSelection = () => {
        return (
          <div>
            {listOfCreators.length > 0 && (
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

    // list of functions on program
    // initializeGameData
    // playerJoinsGame
    // makeMove
    // withdraw

    async function initializeGameData(entry_fee: number) {
        const entry_fee_as_bn = new anchor.BN(entry_fee);
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

        getGameAccountInfo();
    }

    async function playerJoinsGame() {
        const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("chestVault"), publicKey?.toBuffer() as any],
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

        getGameAccountInfo();
    }

    const renderGameBoard = () => {
        {/* render the game board using tailwind,
            use the game board pieces as a reference to render the game board
            the top row of game board is 8-13 and the bottom row is 1-6
            the top row is player 2 and the bottom row is player 1
            0 should be the "score pit" for player 2 and 7 should be the "score pit" for player 1
            the score pits should be larger than the other pits
            the contents of the pits should be the number of pieces in the pit
        */}
        return (
            <div className="flex flex-col items-center">
                <div className="flex flex-row items-center">
                    <p>Entry Fee: {entryFee ? entryFee : '???'}</p>
                </div>
                <div className="flex flex-row items-center gap-20">
                    <p>
                        {playerOne.slice(0, 4)}...{playerOne.slice(-4)}
                    </p>
                    <p>
                        vs.
                    </p>
                    <p>
                        {
                            playerTwo != '11111111111111111111111111111111' ?
                            playerTwo.slice(0, 4) + '...' + playerTwo.slice(-4) :
                            'Waiting for player...'
                        }
                    </p>
                </div>
                <div className="flex justify-around border-2"> {/* Score pits */}
                    <div className="w-16 h-24 border-2 border-white flex items-center justify-center m-4">
                        {gameState[0]} {/* Player 2's score pit */}
                    </div>          
                    <div className="flex flex-col items-center">
                        <div className="flex justify-around"> {/* Player 2's pits */}
                            {gameState.slice(8, 14).map((pit, index) => (
                                <div 
                                    key={index} 
                                    className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                    style={{
                                        borderColor: index + 8 === selectedPit ? "#66ff00" : "white"
                                    }}
                                    onClick={() => {
                                        if (playerTurn === 2) {
                                            setSelectedPit(index + 8),
                                            console.log(selectedPit)
                                        }
                                    }}
                                    
                                >
                                    {/* display the corresponding value by matching the index with the key in game_board_pieces */}
                                    {pit}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-around"> {/* Player 1's pits */}
                            {gameState.slice(1, 7).map((pit, index) => (
                                <div 
                                    key={index} 
                                    className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                    style={{
                                        // if the pit is selected, change the border color to lime green
                                        borderColor: index + 1 === selectedPit ? "#66ff00" : "white"
                                    }}
                                    onClick={() => {
                                        if (playerTurn === 1) {
                                            setSelectedPit(index + 1),
                                            console.log(selectedPit)
                                        }
                                    }}
                                    aria-disabled={playerTurn === 2}
                                >
                                    {pit}
                                </div>
                            ))}
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
            console.log("authority list", decoded.allAuthorities);
            setListOfCreators(
              decoded?.allAuthorities.map((authority: { toString: () => any; }) => {
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
        getGameAccountInfo();
    }, []);

    useEffect(() => {
        getGameState();
    }, [selectedCreator]);

    return (
        <div>
            {   
                !loading && selectedCreator ?
                renderGameBoard() :
                null
            }
            <div
                className="flex flex-col items-center"
            >
                <button 
                    className="border-2 border-white m-4"
                    onClick={() => handleClickGetData()}>Get Game Data
                </button>
                <button 
                    className="border-2 border-white m-4"
                    onClick={() => initializeGameData(1)}
                >
                    Initialize Game Data
                </button>
                <button 
                    className="border-2 border-white m-4"
                    onClick={() => playerJoinsGame()}
                >
                    Join Game
                </button>
            </div>
            <div>
                {renderCreatorSelection()}
            </div>
        </div>
    )
}

export default Game;