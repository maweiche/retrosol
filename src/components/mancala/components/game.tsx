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
import { hash, compare } from "bcryptjs";
import * as anchor from "@project-serum/anchor";
import { notify } from "../../../utils/notifications";

const Game = () => {

    return (
        <div>
            <h1>Mancala Game</h1>
        </div>
    )
}