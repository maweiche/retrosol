import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@project-serum/anchor";
// import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { IDL, HangmanContract } from "../idl/hangman_contract";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
// Create a connection to the devnet cluster
export const connection = new Connection(clusterApiUrl("devnet"), {
  commitment: "confirmed",
});

// Create a placeholder wallet to set up AnchorProvider
const wallet = Keypair.generate();
// const { publicKey } = useWallet()
// Create an Anchor provider
const provider = new AnchorProvider(connection, wallet as any, {});

// Set the provider as the default provider
setProvider(provider);

// Tiny Adventure program ID
//   const programId = new PublicKey("2F2K73Sj1ygx4N9ptCegrxEDvGNLCndrsCdmUbcHej3c")

//Hangman Program ID
const programId = new PublicKey("89qhdKLthboXkjWT8icXditnmnSZAxCtqRXcAEm8Kb5i");
const signId = new PublicKey("CkqtYErfRwYUen6ojKcrQWAJ19GjzWc7AEbANsRs2dxD");

export const program = new Program(
  IDL as Idl,
  programId,
) as unknown as Program<HangmanContract>;

// GameDataAccount PDA
export const [globalLevel1GameDataAccount] = PublicKey.findProgramAddressSync(
  [Buffer.from("hangmanData")], // seed
  programId,
);
