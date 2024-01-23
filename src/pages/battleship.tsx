import type { NextPage } from "next";
import Head from "next/head";
import { BattleshipView } from "../views";

const Battleship: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Battleship - Retro Sol</title>
        <meta name="description" content="Battleship Game" />
      </Head>
      <BattleshipView />
    </div>
  );
};

export default Battleship;
