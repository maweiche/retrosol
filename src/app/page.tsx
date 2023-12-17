'use client'
import { Inter } from 'next/font/google'
import Landing from '../../components/landing/landing'
import Overview from '../../components/overview/overview'
import Showcase from '../../components/showcase/showcase'
import Faq from '../../components/faq/faq'
import Footer from '../../components/footer/footer'
import styles from './page.module.css'

import dynamic from "next/dynamic";
import React, { useMemo, useEffect } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // const [user, setUser] = React.useState({ loading: false, user: null });
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet;
  
    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
    const WalletMultiButton = dynamic(
      async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
      { ssr: false }
    );
  
    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded
    const wallets = useMemo(
      () => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
        new TorusWalletAdapter(),
      ],
      [network]
    );
  return (
    <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <main className={styles.main}>
                <div className={styles.wallet}>
                    <WalletMultiButton />
                </div>
                <Landing />
                <Overview />
                <Showcase />
                <Faq />
            </main>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
