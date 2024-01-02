import type { NextPage } from "next";
import Head from "next/head";
import { ParclView } from "../views";

const Hangman: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Parcl - Retro Sol</title>
        <meta
          name="description"
          content="Parcl Data"
        />
      </Head>
      <ParclView />
    </div>
  );
};

export default Hangman;