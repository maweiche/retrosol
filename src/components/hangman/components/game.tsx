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
import { hash, compare } from "bcryptjs";
import * as anchor from "@project-serum/anchor";
import { notify } from "../../../utils/notifications";
require("@solana/wallet-adapter-react-ui/styles.css");

// words     = checkWord('en');
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

type GameDataAccount = {
  solved: boolean;
  all_authorities: Array<PublicKey>;
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
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listOfCreators, setListOfCreators] = useState<Array<PublicKey>>([]);
  const [selectedCreator, setSelectedCreator] = useState<
    PublicKey | null | string
  >(null);
  const [listOfPlayers, setListOfPlayers] = useState([]);
  const [globalLevel1GameDataAccount, setGlobalLevel1GameDataAccount] =
    useState<PublicKey | null>(null);
  const [message, setMessage] = useState("");
  const [playerPositionOnChain, setPlayerPositionOnChain] = useState("");
  const [incorrectGuesses, setIncorrectGuesses] = useState("");
  const [secretWordOnChain, setSecretWordOnChain] = useState("");
  const [secretWordOnChainArray, setSecretWordOnChainArray] = useState([]);
  const [chestRewardOnChain, setChestRewardOnChain] = useState(0);
  const [maxAttemptsOnChain, setMaxAttemptsOnChain] = useState(0);
  const [entryFeeOnChain, setEntryFeeOnChain] = useState(0);
  const [authorityOnChain, setAuthorityOnChain] = useState("");
  const [playersOnChain, setPlayersOnChain] = useState([]);
  const [playerHasPaid, setPlayerHasPaid] = useState(false);

  const [secretWord, setSecretWord] = useState("");
  const [guessesLeft, setGuessesLeft] = useState(6);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [blanks, setBlanks] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  const [letterToGuess, setLetterToGuess] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [incorrectAnswer, setIncorrectAnswer] = useState(false);
  const [winner, setWinner] = useState(false);

  const [creatingNewGame, setCreatingNewGame] = useState(false);
  const [chestReward, setChestReward] = useState<string>("");
  const [entryFee, setEntryFee] = useState<string>("");
  const [maxAttempts, setMaxAttempts] = useState<string>("");
  const [playerIndexInGameList, setPlayerIndexInGameList] = useState<
    number | null
  >(null);

  const [gameDataAccount, setGameDataAccount] = useState<any | null>(null);

  const [chestVaultAccount, setChestVaultAccount] = useState<PublicKey | null>(
    null,
  );

  async function checkWordValidity(word: string) {
    let valid = false;
    try {
      const response = await fetch(`/api/dictionary?word=${word}`);
      const { data } = await response.json();
      if (data.meanings.length > 0) {
        valid = true;
      }
    } catch (error) {
      console.error(error);
    }

    return valid;
  }

  // game selection logic here
  async function handleClickSelectCreator(creator: any) {
    setSelectedCreator(creator);
    await handleClickGetData();
  }

  const renderCreatorSelection = () => {
    return (
      <div>
        {listOfCreators.length > 0 ? (
          <div className="flex flex-col justify-center items-center space-y-2 border-2 border-white p-6">
            <p>Select a creator</p>
            <select
              className="text-black"
              value={selectedCreator?.toString()}
              onChange={(e) => handleClickSelectCreator(e.target.value)}
            >
              <option value={null}>Select a creator</option>
              {listOfCreators.map((creator: PublicKey, index: number) => {
                return (
                  <option key={index} value={creator.toString()}>
                    {creator.toString()}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center space-y-2 underline">
            {creatingNewGame ? (
              <p>Enter your settings</p>
            ) : (
              <p>No active games, try creating one!</p>
            )}
          </div>
        )}
      </div>
    );
  };

  //*************************************** */

  //game creation
  const handleClickCreateGame = async () => {
    setCreatingNewGame(!creatingNewGame);
  };

  //*************************************** */

  // hangman game logic here

  async function handleClickGetData() {
    setLoading(true);
    const main_key = new PublicKey(
      "7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n",
      // "HZxkqBTnXtAYoFTg2puo9KyiNN42E8Sd2Kh1jq3vT29u"
    );
    let data = PublicKey.findProgramAddressSync(
      [Buffer.from("hangmanData")],
      program.programId,
    );
    setGlobalLevel1GameDataAccount(data[0]);

    const game_account_info = await connection.getAccountInfo(data[0]);

    if (game_account_info != null) {
      const game_data_decoded = program.coder.accounts.decode(
        "GameDataAccount",
        game_account_info?.data,
      );

      setListOfCreators(
        game_data_decoded?.allCreators.map(
          (creator: { toString: () => any }) => {
            return creator.toString();
          },
        ),
      );
      setGameDataAccount(game_data_decoded);
    }

    if (selectedCreator) {
      const creator_key = new PublicKey(selectedCreator);
      const treasure = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("chestVault"), creator_key.toBuffer()],
        program.programId,
      );
      setChestVaultAccount(treasure[0]);

      const treasure_account_info = await connection.getAccountInfo(
        treasure[0],
      );

      if (treasure_account_info != null) {
        const chest_vault_account = await program.coder.accounts.decode(
          "ChestVaultAccount",
          treasure_account_info?.data,
        );

        setChestRewardOnChain(chest_vault_account?.chestReward.toNumber());
        setMaxAttemptsOnChain(chest_vault_account?.maxAttemptsLeft);
        setEntryFeeOnChain(chest_vault_account?.entryFee.toNumber());
        setSecretWordOnChain(chest_vault_account?.password);
        setAuthorityOnChain(chest_vault_account?.creator.toString());
        setPlayersOnChain(chest_vault_account?.players);
        const secret_word_array = chest_vault_account?.password;
        setSecretWordOnChainArray(secret_word_array);

        const correct_letters = [];

        for (
          let i = 0;
          i < secret_word_array?.split(process.env.NEXT_PUBLIC_SPLIT_KEY);
          i++
        ) {
          correct_letters.push("_");
          const blanks: string[] = [];
          blanks.push("_");
        }
        setBlanks(correct_letters);
        setMaxAttemptsOnChain(chest_vault_account?.maxAttemptsLeft);

        const list_of_players = chest_vault_account?.players;
        setListOfPlayers(chest_vault_account?.players);
        // find the index of the player in the players array
        if (list_of_players?.length > 0) {
          // chest_vault_account?.players is an array of objects, find the index of the one that's player field matches publicKey.toString()
          const player_index = list_of_players.findIndex(
            (player: { player: { toString: () => string } }) => {
              return player.player.toString() === publicKey?.toString();
            },
          );
          if (
            player_index != null &&
            player_index != undefined &&
            player_index >= 0
          ) {
            setPlayerHasPaid(true);
            setPlayerIndexInGameList(player_index);
            
            if (list_of_players[player_index].incorrectGuesses?.length < 6) {
              list_of_players[player_index].correctLetters.forEach(
                (letter: string) => {
                  if (letter != "_") {
                    correctLetters.push(letter);
                  }
                },
              );
              setGuessesLeft(
                6 - list_of_players[player_index].incorrectGuesses.length,
              );
              setIncorrectGuesses(
                list_of_players[player_index].incorrectGuesses,
              );
              setCorrectLetters(list_of_players[player_index].correctLetters);

              setWinner(list_of_players[player_index].isWinner);
              guessedLetters.push(
                ...list_of_players[player_index].correctLetters,
                ...list_of_players[player_index].incorrectGuesses,
              );

              if (list_of_players[player_index].incorrectGuesses.length == 0) {
                setActiveImage(0);
              } else {
                setActiveImage(
                  list_of_players[player_index].incorrectGuesses.length,
                );
              }
            }
          }
        }
      }
    }

    setLoading(false);
  }

  async function hashWord(word: string) {
    let hashed_word_array = [];
    // create an array from the secret word with each letter as an index
    let secret_word_array = word.split("");
    for (let i = 0; i < secret_word_array.length; i++) {
      secret_word_array[i] = secret_word_array[i].toLowerCase();
      let hashed_word = await hash(secret_word_array[i], 10); //10 is the salt
      hashed_word_array.push(hashed_word);
    }
    const new_secret_word = hashed_word_array.join(
      process.env.NEXT_PUBLIC_SPLIT_KEY,
    );

    return new_secret_word;
  }

  async function handleClickInitialize() {
    let valid: boolean = await checkWordValidity(secretWord);
    if (!valid) {
      notify({
        type: "error",
        message: "Invalid word!",
        description: "Invalid word!",
      });
      return;
    }
    const new_secret_word = await hashWord(secretWord);
    
    notify({
      type: "loading",
      message: "loading",
      description: "Initializing game...",
    });

    if (publicKey) {
      
      const reward_as_bn = new anchor.BN(
        // parse chestReward as a float and convert to lamports
        parseFloat(chestReward!) * anchor.web3.LAMPORTS_PER_SOL,
      );
      const entry_fee_as_bn = new anchor.BN(
        // parse entryFee as a float and convert to lamports
        parseFloat(entryFee!) * anchor.web3.LAMPORTS_PER_SOL,
      );
      const max_attempts = parseInt(maxAttempts!);
      
      const newChestVaultAccount = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("chestVault"), publicKey?.toBuffer() as any],
        program.programId,
      );
      const [newGameDataAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("hangmanData")],
        program.programId,
      );
      
      const transaction = await program.methods
        .initializeLevelOne(
          reward_as_bn,
          new_secret_word,
          max_attempts,
          entry_fee_as_bn,
        )
        .accounts({
          newGameDataAccount: newGameDataAccount as any,
          chestVaultAccount: newChestVaultAccount[0] as any,
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
      setCreatingNewGame(false);
      handleClickGetData();
      
      console.log(
        "txHash",
        `https://solana.fm/tx/${txHash}/?cluster=devnet-solana`,
      );
      notify({
        type: "success",
        message: `Success! https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
        description: "Success Txn Link",
      });
    } else {
      try {
        const response = await fetch("/api/sendTransaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instruction: "initializeLevelOne" }),
        });
        await response.json();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function handleClickPlayerStartGame() {
    notify({
      type: "loading",
      message: "Starting game...",
      description: "Starting game...",
    });
    if (publicKey) {
      // const password = secretWord
      const transaction = await program.methods
        .playerStartsGame()
        .accounts({
          gameDataAccount: globalLevel1GameDataAccount as any,
          chestVaultAccount: chestVaultAccount as any,
          signer: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .transaction();

      const txHash = await sendTransaction(transaction, connection);

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const confirmTransaction = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: txHash,
      });
      handleClickGetData();
    } else {
      try {
        const response = await fetch("/api/sendTransaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instruction: "playerStartsGame" }),
        });
        const data = await response.json();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function handleClickRight(letterToGuess: string) {
    notify({
      type: "loading",
      message: "Checking guess...",
      description: "Checking guess...",
    });
    // guessedLetters.push(letterToGuess);
    // get the secret word from the chest vault account
    let correct_letter = false;
    let correct_letter_indexes = [];
    const secret_word = secretWordOnChain;
    const secret_word_array = secret_word.split(
      process.env.NEXT_PUBLIC_SPLIT_KEY,
    );
    for (let i = 0; i < secret_word_array.length; i++) {
      let lower_case_letter = letterToGuess.toLowerCase();
      // use comparePassword to compare the letterToGuess to each letter in the secret word
      const is_correct = await compare(lower_case_letter, secret_word_array[i]);

      if (is_correct) {
        correct_letter = true;
        correct_letter_indexes.push(i);
      }
    }
    setCheckingAnswer(true);
    if (publicKey && correct_letter) {
      const transaction = await program.methods
        .addCorrectLetter(letterToGuess, Buffer.from(correct_letter_indexes))
        .accounts({
          gameDataAccount: globalLevel1GameDataAccount as any,
          chestVaultAccount: chestVaultAccount as any,
          player: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .transaction();

      const txHash = await sendTransaction(transaction, connection);

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const confirmTransaction = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: txHash,
      });
      setCheckingAnswer(false);
      setLetterToGuess("");
    } else if (publicKey && !correct_letter) {
      try {
        const transaction = await program.methods
          .addIncorrectLetter(letterToGuess)
          .accounts({
            gameDataAccount: globalLevel1GameDataAccount as any,
            chestVaultAccount: chestVaultAccount as any,
            player: publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .transaction();

        const txHash = await sendTransaction(transaction, connection);

        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();

        const confirmTransaction = await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature: txHash,
        });
        setCheckingAnswer(false);
        setLetterToGuess("");
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function handleClickClaimPrize() {
    notify({
      type: "loading",
      message: "Claiming prize...",
      description: "Claiming prize...",
    });
    if (publicKey) {
      const transaction = await program.methods
        .getChestReward()
        .accounts({
          gameDataAccount: globalLevel1GameDataAccount as any,
          chestVaultAccount: chestVaultAccount as any,
          player: publicKey,
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

      notify({
        type: "success",
        message: `Success! https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
        description: "Success!",
      });
    } else {
      try {
        const response = await fetch("/api/sendTransaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instruction: "claimPrize" }),
        });
        const data = await response.json();
      } catch (error) {
        notify({ type: "error", message: `Error!`, description: "Error!" });
        console.error(error);
      }
    }
    window.location.reload();
  }

  async function handleClickWithdraw() {
    notify({
      type: "success",
      message: "Withdrawing!",
      description: "Withdrawing!",
    });
    if (publicKey) {
      const transaction = await program.methods
        .withdraw()
        .accounts({
          chestVaultAccount: chestVaultAccount as any,
          gameDataAccount: globalLevel1GameDataAccount as any,
          signer: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .transaction();

      const txHash = await sendTransaction(transaction, connection);

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const confirmTransaction = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: txHash,
      });

      notify({
        type: "success",
        message: `Success! https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
        description: "Success!",
      });
    } else {
      try {
        const response = await fetch("/api/sendTransaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instruction: "withdraw" }),
        });
        const data = await response.json();

      } catch (error) {
        notify({ type: "error", message: "Error!", description: "Error!" });
        console.error(error);
      }
    }
    window.location.reload();
  }

  const fetchData = async (pda: PublicKey) => {
    try {
      const account = await program.account.GameDataAccount.fetch(pda);
      setGameDataAccount(account);
    } catch (error) {
      console.log(`Error fetching GameDataAccount state: ${error}`);
    }
  };

  async function getTreasureAccount() {
    const treasure = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault"), publicKey?.toBuffer() as any],
      program.programId,
    );
    setChestVaultAccount(treasure[0]);
  }

  async function getGameTreasureAccount() {
    const selected_creator = new PublicKey(selectedCreator as any);
    const global_data = await PublicKey.findProgramAddressSync(
      [Buffer.from("hangmanData")],
      program.programId,
    );

    setGlobalLevel1GameDataAccount(global_data[0]);

    const treasure = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault"), selected_creator.toBuffer()],
      program.programId,
    );
    setChestVaultAccount(treasure[0]);
  }

  // **********************************
  const renderCreateGame = () => {
    return (
      <div className="flex flex-col justify-center items-center space-y-2">
        <div className="flex flex-col justify-center items-center space-y-2">
          <p>Secret Word</p>
          <p>Max 10 letters</p>
          <input
            style={{ color: "black", padding: "4px" }}
            maxLength={10}
            value={secretWord!}
            onChange={(e) => setSecretWord(e.target.value.toLowerCase())}
          />
        </div>

        <div className="flex flex-col justify-center items-center space-y-2">
          <p>Entry Fee</p>
          <input
            style={{ color: "black", padding: "4px" }}
            value={entryFee!}
            onChange={(e) => setEntryFee(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-center items-center space-y-2">
          <p>Max Attempts on Game</p>
          <input
            style={{ color: "black", padding: "4px" }}
            value={maxAttempts!}
            onChange={(e) => setMaxAttempts(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-center items-center space-y-2">
          <p>Chest Reward</p>
          <input
            style={{ color: "black", padding: "4px" }}
            value={chestReward!}
            onChange={(e) => setChestReward(e.target.value)}
          />
        </div>

        <button
          onClick={handleClickInitialize}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Game
        </button>
      </div>
    );
  };

  // GAME BOARD RENDER SECTION

  const renderGameBoard = () => {
    return (
      <div className="flex flex-col justify-center items-center space-y-2">
        <img
          src={activeImage ? `/hangman${activeImage}.png` : "/hangman0.png"}
          alt="hangman"
          width="200"
        />
        {secretWordOnChain?.length > 0 && (
          <div className="flex flex-row justify-center items-center space-y-2">
            <div className="flex flex-row justify-center items-center">
              {correctLetters.map((letter, index) => {
                return (
                  <div
                    key={index}
                    // font size 2xl
                    className="m-2 text-6xl"
                  >
                    {/* map out each letter with a space in between, do not put space after last letter */}
                    {index < correctLetters?.length - 1 ? (
                      <div>{letter} </div>
                    ) : (
                      <div>{letter} </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div>
              {blanks.map((letter, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-row justify-center items-center space-y-2"
                  >
                    {letter}{" "}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <p>
            Owner:{" "}
            {authorityOnChain.toString().slice(0, 4) +
              "..." +
              authorityOnChain.toString().slice(-4)}
          </p>
          <p>Game Attempts Left: {maxAttemptsOnChain}</p>
          {maxAttemptsOnChain > 0 ? (
            <div className="flex flex-col justify-center items-center space-y-2 border-2 border-white p-2 m-2">
              <p>Jackpot: {chestRewardOnChain / LAMPORTS_PER_SOL}</p>
              <p>Entry Fee: {entryFeeOnChain / LAMPORTS_PER_SOL}</p>
            </div>
          ) : (
            <p className="flex flex-col justify-center items-center space-y-2 text-red-500">
              Game Limit Reached
            </p>
          )}
          {/* {maxAttemptsOnChain > 0 && (
            <> */}
          {playerIndexInGameList >= 0 && playerHasPaid && (
            <div className="flex flex-col justify-center items-center space-y-2">
              <p>Guesses left: {guessesLeft}</p>
              <p>Guessed letters: {incorrectGuesses}</p>
              <div className="flex flex-col justify-center items-center space-y-2 border-2 border-white p-6">
                <p className="underline">Guess a letter</p>
                <input
                  type="p"
                  className="text-black p-2 w-10 text-center"
                  maxLength={1}
                  value={letterToGuess}
                  onChange={(event) => {
                    if (!guessedLetters?.includes(event.target.value)) {
                      setLetterToGuess(event.target.value);
                    }
                  }}
                />
                <button
                  onClick={() => handleClickRight(letterToGuess)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Guess
                </button>
              </div>
            </div>
          )}
          {!playerHasPaid && chestVaultAccount && (
            <div className="flex flex-col justify-center items-center space-y-2 border-2 border-white p-2">
              <button
                // isLoading={loadingInitialize}
                onClick={handleClickPlayerStartGame}
              >
                Start Game
              </button>
            </div>
          )}
          {/* </>
          )} */}
        </div>
      </div>
    );
  };

  // **********************************

  // USE EFFECTS
  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "Enter") {
        handleClickRight(letterToGuess);
      }
      if (event.key === "Escape") {
        setLetterToGuess("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [letterToGuess]);

  useEffect(() => {
    if (correctAnswer) {
      setTimeout(() => {
        setCorrectAnswer(false);
      }, 2000);
    }
    if (incorrectAnswer) {
      setTimeout(() => {
        setIncorrectAnswer(false);
      }, 2000);
    }
  }, [correctAnswer, incorrectAnswer]);

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
          decoded?.allCreators.map((creator: { toString: () => any }) => {
            return creator.toString();
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
    if (!chestVaultAccount) return;
    const current_player_position = playerPositionOnChain;
    const current_incorrect_guesses = incorrectGuesses;
    const subscriptionId = connection.onAccountChange(
      chestVaultAccount,
      (accountInfo) => {
        const decoded = program.coder.accounts.decode(
          "ChestVaultAccount",
          accountInfo.data,
        );
        setChestRewardOnChain(decoded.chestReward);
        setMaxAttemptsOnChain(decoded.maxAttempts);
        setEntryFeeOnChain(decoded.entryFee);
        setSecretWordOnChain(decoded.password);
        setAuthorityOnChain(decoded.creator);
        setPlayersOnChain(decoded.players);
        const player_vector = decoded.players;
        let player_is_in_game = false;
        // find the index of publicKey that matches player_vector[i].player.toString()
        const player_index = player_vector.findIndex(
          (player: { player: { toString: () => string } }) => {
            player_is_in_game = true;
            return player.player.toString() === publicKey?.toString();
          },
        );
        if (
          player_is_in_game &&
          player_vector[player_index].player_position > current_player_position
        ) {
          setCorrectAnswer(true);
          notify({
            type: "success",
            message: `Correct!`,
            description: "Correct!",
          });
        } else if (
          player_vector[player_index].incorrectGuesses.length >
          current_incorrect_guesses.length
        ) {
          setIncorrectAnswer(true);
          setGuessesLeft(guessesLeft - 1);
          setActiveImage(activeImage + 1);
          notify({
            type: "success",
            message: `Incorrect Guess!`,
            description: "Incorrect!",
          });
        } else if (!player_is_in_game) {
          notify({
            type: "error",
            message: `You are not in this game!`,
            description: "Error!",
          });
        }
        if (player_is_in_game) {
          setPlayerPositionOnChain(
            decoded.players[player_index].playerPosition,
          );
          setCorrectLetters(decoded.players[player_index].correctLetters);
          setIncorrectGuesses(decoded.players[player_index].incorrectGuesses);
          
          let newGuessedLetters = [];
          newGuessedLetters.push(
            ...decoded.players[player_index].correctLetters,
          );
          newGuessedLetters.push(
            ...decoded.players[player_index].incorrectGuesses,
          );
          setGuessedLetters(newGuessedLetters);
          setWinner(decoded.players[player_index].isWinner);
        }
        const secret_word_array = decoded.password.split(
          process.env.NEXT_PUBLIC_SPLIT_KEY,
        );
        setSecretWordOnChainArray(secret_word_array);

        // if playerPosition has changed (increased) then add the letterToGuess to correctLetters
        if (
          player_is_in_game &&
          decoded.playerPosition > current_player_position
        ) {
          correctLetters.push(letterToGuess);
          setCorrectLetters(correctLetters);
        } else {
          guessesLeft - 1;
        }
        setPlayerPositionOnChain(decoded.playerPosition);
        // notify({ type: 'success', message: 'Chest Vault Account updated!', description: 'Success!' });
        // chestBump(decoded.chestReward)
      },
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, chestVaultAccount, program]);

  useEffect(() => {
    if (publicKey) {
      handleClickGetData();
    }
  }, [selectedCreator]);

  useEffect(() => {
    if (publicKey && chestVaultAccount == null) {
      getTreasureAccount();
    }
    if (
      publicKey &&
      selectedCreator &&
      !creatingNewGame &&
      !chestVaultAccount
    ) {
      const creator_key = new PublicKey(selectedCreator);
      getGameTreasureAccount();
      if (globalLevel1GameDataAccount) {
        fetchData(globalLevel1GameDataAccount);
      } else {
        let main_key = new PublicKey(
          "7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n",
        );
        let data = PublicKey.findProgramAddressSync(
          [Buffer.from("hangmanData")],
          program.programId,
        );
        setGlobalLevel1GameDataAccount(data[0]);
      }
    }
    if (publicKey && creatingNewGame) {
      const creator_key = new PublicKey(publicKey.toString());
      if (globalLevel1GameDataAccount) {
        fetchData(globalLevel1GameDataAccount).then((data) => {
        });
      } else {
        let data = PublicKey.findProgramAddressSync(
          [Buffer.from("hangmanData")],
          program.programId,
        );
        setGlobalLevel1GameDataAccount(data[0]);
      }
    }
  }, [
    publicKey,
    globalLevel1GameDataAccount,
    selectedCreator,
    creatingNewGame,
  ]);

  return (
    <div>
      {!loading && (
        <div className="flex flex-col justify-center items-center space-y-2">
          <button
            onClick={handleClickGetData}
            // give a white border
            className="border-2 border-white p-2"
          >
            Get Data
          </button>
          {listOfCreators && renderCreatorSelection()}
          {creatingNewGame && !selectedCreator && renderCreateGame()}
          <div>
            {!selectedCreator && (
              <div className="flex flex-col justify-center items-center space-y-2">
                {!creatingNewGame && <p>Create New Game?</p>}
                <div className="flex flex-row justify-center items-center space-x-2">
                  <button
                    onClick={handleClickCreateGame}
                    className="border-2 border-white p-2"
                  >
                    {creatingNewGame ? "Cancel" : "Create"}
                  </button>
                </div>
              </div>
            )}
            {!loading && chestVaultAccount && selectedCreator != null && (
              <div className="flex flex-col justify-center items-center">
                {renderGameBoard()}
              </div>
            )}
          </div>

          {winner && (
            <div className="flex flex-col justify-center items-center space-y-2">
              <h1>You won!</h1>
              <button
                className="border-2 border-white p-2 bg-green-500 hover:bg-green-700"
                onClick={handleClickClaimPrize}
              >
                Claim Prize
              </button>
            </div>
          )}
          {listOfCreators &&
            chestVaultAccount &&
            selectedCreator?.toString() == publicKey?.toString() && (
              <button
                onClick={handleClickWithdraw}
                className="border-2 border-white p-2 bg-green-500 hover:bg-green-700"
              >
                Withdraw all funds in chest
              </button>
            )}
        </div>
      )}
    </div>
  );
};

export default Game;
