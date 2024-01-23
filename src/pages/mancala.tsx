import type { NextPage } from "next";
import Head from "next/head";
import { MancalaView } from "../views";

const Hangman: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Mancala - Retro Sol</title>
        <meta name="description" content="Mancala Game" />
      </Head>
      <MancalaView />
    </div>
  );
};

export default Hangman;
