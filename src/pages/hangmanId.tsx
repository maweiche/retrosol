import type { NextPage } from "next";
import Head from "next/head";
import { HangmanSpecificView } from "../views";

const Hangman: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Hangman - Retro Sol</title>
        <meta name="description" content="Hangman Game" />
      </Head>
      <HangmanSpecificView />
    </div>
  );
};

export default Hangman;
