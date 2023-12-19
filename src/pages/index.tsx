import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Retro Sol</title>
        <meta
          name="description"
          content="Retro Sol is a retro gaming platform built on Solana."
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
