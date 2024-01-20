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
    // game board states
    const [selectedSquareToAttack, setSelectedSquareToAttack] = useState<Array<number> | null>(null); 

    // program states
    const [programId, setProgramId] = useState<PublicKey | null>(null);
    const [allCreators, setAllCreators] = useState<Array<PublicKey> | null>(null);

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

    // Get Data from the selected ChestVaultAccount

    // Create ChestVaultAccount/Game

    // Join existing ChestVaultAccount/Game

    // Set Game Board

    // Attack Square

    // Withdraw winnings

    // Close ChestVaultAccount

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
  
    return (
        <div>
            {renderGameBoard()}
        </div>
    );
};

export default Game;
