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
  solved: boolean;
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
    // game board states
    const [selectedSquareToAttack, setSelectedSquareToAttack] = useState<Array<number> | null>(null); 

    // game logic
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


    const renderGameBoard = () => {
        return (
            <>
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
                                    }}
                                    onClick={() => {
                                        setSelectedSquareToAttack([i, j]);
                                        // console log the square that was clicked [row, col]
                                        console.log([i, j]);
                                    }}
                                >
                                    {
                                        square === 0 ? "" : square === 7 ? "O" : square === 8 || square === 9 ? "X" : ""
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
                                    }}
                                    onClick={() => {
                                        setSelectedSquareToAttack([i + 5, j]);
                                        // console log the square that was clicked [row, col]
                                        console.log([i + 5, j]);
                                    }}
                                >
                                    {
                                        //if the square is a 0, display nothing, if it is a 7 display O, if it is a 8/9 display X, else display nothing
                                        square === 0 ? "" : square === 7 ? "O" : square === 8 || square === 9 ? "X" : ""
                                    }
                                </div>
                            ))
                        ))
                    }
                </div>
            </>
        )
    }
  
    return (
        <div>
            {renderGameBoard()}
        </div>
    );
};

export default Game;
