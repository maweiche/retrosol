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
        []
    );

    const [listOfCreators, setListOfCreators] = useState([
        publicKey?.toBase58() as string
    ]);
    const [selectedCreator, setSelectedCreator] = useState<String>();
    const [chestVaultAccountFetched, setChestVaultAccountFetched] = useState<PublicKey>();
    const [hookedGame, setHookedGame] = useState<boolean>(false);

    const [entryFee, setEntryFee] = useState(0);
    const [playerTurn, setPlayerTurn] = useState('');
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

    async function initializeGameData(entry_fee: string) {
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

        getGameAccountInfo();
    }

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

    async function makeMove(selectedPit: number) {
        const creator_pubkey = new PublicKey(selectedCreator);
        const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
            program.programId
        );
        console.log("chest vault account", chestVaultAccount[0].toString());
        const transaction = await program.methods
            .makeMove(selectedPit)
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
        setSelectedPit(-1);
        await getGameState();
    }

    async function withdraw() {
        const creator_pubkey = new PublicKey(selectedCreator);
        const chestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("chestVault"), creator_pubkey?.toBuffer() as any],
            program.programId
        );
        console.log("chest vault account", chestVaultAccount[0].toString());
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
        
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    
        await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature: txHash,
        });

        await getGameState();
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
                {chestVaultAccountFetched && (
                    <div className="flex flex-col items-center">
                        {/* convert entryFee to a normal number from big number */}
                        <p>Entry Fee: {entryFee ? entryFee / anchor.web3.LAMPORTS_PER_SOL : '???'} SOL</p>
                        <p>{playerTurn === publicKey?.toString() ? 'YOUR TURN' : `${playerTurn.slice(0,4)}...${playerTurn.slice(-4)}`}</p>
                    </div>
                )}
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
                            {/* 
                                map the gameState.slice(8,14) but in reverse 
                                the gameState indexes should be:
                                13, 12, 11, 10, 9, 8
                            */}
                            {/* {gameState.slice(8, 14).map((pit, index) => (
                                <div 
                                    key={index} 
                                    className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                    style={{
                                        borderColor: index + 8 === selectedPit ? "#66ff00" : "white"
                                    }}
                                    onClick={() => {
                                        if (playerTurn === playerTwo) {
                                            setSelectedPit(index + 8),
                                            console.log(index + 8)
                                        }
                                    }}
                                    aria-disabled={playerTurn === playerTwo ? false : true}
                                >
                                    {pit}
                                </div>
                            ))} */}
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 13 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerTwo) {
                                        setSelectedPit(13)
                                    }
                                }}
                                // aria-disabled={playerTurn === playerTwo ? false : true}
                            >
                                {gameState[13]}
                                
                            </div>
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 12 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerTwo) {
                                        setSelectedPit(12)
                                    }
                                }}
                                // aria-disabled={playerTurn === playerTwo ? false : true}
                            >
                                {gameState[12]}
                                
                            </div>
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 11 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerTwo) {
                                        setSelectedPit(11)
                                    }
                                }}
                                // aria-disabled={playerTurn === playerTwo ? false : true}
                            >
                                {gameState[11]}
                                
                            </div>
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 10 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerTwo) {
                                        setSelectedPit(10)
                                    }
                                }}
                                // aria-disabled={playerTurn === playerTwo ? false : true}
                            >
                                {gameState[10]}
                                
                            </div>
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 9 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerTwo) {
                                        setSelectedPit(9)
                                    }
                                }}
                                // aria-disabled={playerTurn === playerTwo ? false : true}
                            >
                                {gameState[9]}
                            
                            </div>
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 8 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerTwo) {
                                        setSelectedPit(8)
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
                                    borderColor: 1 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerOne) {
                                        setSelectedPit(1)
                                    }
                                }}
                                // aria-disabled={playerTurn === playerTwo ? false : true}
                            >
                                {gameState[1]}
                            </div>
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 2 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerOne) {
                                        setSelectedPit(2)
                                    }
                                }}
                                // aria-disabled={playerTurn === playerTwo ? false : true}
                            >
                                {gameState[2]}
                            </div>
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 3 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerOne) {
                                        setSelectedPit(3)
                                    }
                                }}
                                // aria-disabled={playerTurn === playerTwo ? false : true}
                            >
                                {gameState[3]}
                            </div>
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 4 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerOne) {
                                        setSelectedPit(4)
                                    }
                                }}
                                // aria-disabled={playerTurn === playerTwo ? false : true}
                            >
                                {gameState[4]}
                            </div>
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 5 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerOne) {
                                        setSelectedPit(5)
                                    }
                                }}
                                // aria-disabled={playerTurn === playerTwo ? false : true}
                            >
                                {gameState[5]}
                            </div>
                            <div 
                                className="w-12 h-12 border-2 border-white flex items-center justify-center m-2"
                                style={{
                                    borderColor: 6 === selectedPit ? "#66ff00" : "white"
                                }}
                                onClick={() => {
                                    if (playerTurn === playerOne) {
                                        setSelectedPit(6)
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
        if (!chestVaultAccountFetched) return;
        console.log('chestVault hooked')
        const subscriptionId = connection.onAccountChange(
            chestVaultAccountFetched as PublicKey,
            (accountInfo) => {
                const decoded = program.coder.accounts.decode(
                    "ChestVaultAccount",
                    accountInfo.data,
                );

                console.log('updating......')
                console.log(decoded);
                setGameState(decoded.gameBoard);
                setWinner(
                    decoded.scoreSheet.winner.toString() != '11111111111111111111111111111111' ?
                    decoded.scoreSheet.winner.toString() :
                    'No Winner Yet'
                );
                setGameOver(decoded.scoreSheet.gameOver);
                setPlayerTurn(decoded.scoreSheet.currentMove.toString());
            }
        );

        if (gameOver && winner != '11111111111111111111111111111111') {
            notify({
                message: `Game Over! Winner is ${winner.slice(0,4)}...${winner.slice(-4)}`,
                type: "success",
            });
            return () => {
                connection.removeAccountChangeListener(subscriptionId);
            }
        }
    }, [chestVaultAccountFetched]);

    useEffect(() => {
        getGameAccountInfo();
    }, []);

    useEffect(() => {
        getGameState();
    }, [selectedCreator]);

    return (
        <div>
            {/* {   
                !loading && selectedCreator ?
                renderGameBoard() :
                null
            } */}
            {chestVaultAccountFetched && renderGameBoard()}
            <div
                className="flex flex-col items-center"
            >
                <button 
                    className="border-2 border-white m-4"
                    onClick={() => handleClickGetData()}
                >
                    Check for Games
                </button>
                {selectedCreator &&(
                    <button 
                        className="border-2 border-white m-4"
                        onClick={() => getGameState()}
                    >
                        Get Game State
                    </button>
                )}
                {chestVaultAccountFetched && playerTwo == '11111111111111111111111111111111' && (
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
                    <div
                        className="flex flex-col items-center"
                    >
                        <p>Game Over!</p>
                        <p>Winner: {winner.slice(0,4)}...{winner.slice(-4)}</p>
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
            <div
                className="flex flex-col items-center"
            >
                {renderCreatorSelection()}
                {!chestVaultAccountFetched && (
                    <button 
                        className="border-2 border-white m-4"
                        onClick={() => initializeGameData('.25')}
                    >
                        Create Game
                    </button>
                )}
            </div>
            
        </div>
    )
}

export default Game;