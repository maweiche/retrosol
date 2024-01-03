/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from "react";
import { useEffect, useState } from "react";
import { states } from "./states";
import { LAMPORTS_PER_SOL, PublicKey, Transaction, Connection } from "@solana/web3.js";
import Link from "next/link";
const Parcl = () => {
    const [loading, setLoading] = useState(false);

    const [showStates, setShowStates] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [cityData, setCityData] = useState(null);

    const [marketSingles, setMarketSingles] = useState(null); 
    const [marketData, setMarketData] = useState(null);

    const [usdcBalance, setUsdcBalance] = useState(null);

    const [signatures, setSignatures] = useState(null);
    const [parsedTransactions, setParsedTransactions] = useState(null);
    const [lastLiquidation, setLastLiquidation] = useState(null);
    // usdc mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
    // liquidity pool: 82dGS7Jt4Km8ZgwZVRsJ2V6vPXEhVdgDaMP7cqPGG1TW
    // liquidity usdc token account: Ai9AuTfGncuFxEknjZT4HU21Rkv98M1QyXpbW9Xct6LK
    // liquidatorWallet: 6dDCUve96a1Cqw3Zv34wfbCGwU77UEPe13953UdanTnT
    const rpcEndpoint = process.env.NEXT_PUBLIC_HELIUS_RPC;
    const connection = new Connection(rpcEndpoint, 'confirmed');
    const tokenAccount=new PublicKey('Ai9AuTfGncuFxEknjZT4HU21Rkv98M1QyXpbW9Xct6LK');
    async function getTokenBalanceWeb3() {
        const info = await connection.getTokenAccountBalance(tokenAccount);
        if (!info.value.uiAmount) throw new Error('No balance found');
        return info.value.uiAmount;
    }

    async function getRecentTransactions() {
        const signatures = await connection.getSignaturesForAddress(tokenAccount, {limit: 10});
        setSignatures(signatures);

        const recentTxns = [];
        for (let i = 0; i < signatures.length; i++) {
            const parsedTransaction = await connection.getParsedTransaction(signatures[i].signature);
            const txn = parsedTransaction.meta.innerInstructions[0].instructions[1];
            
            // @ts-ignore
            if(txn.parsed !== undefined){
                const ix = {
                    signature: signatures[i].signature,
                    // @ts-ignore
                    authority: txn.parsed.info.authority,
                    // @ts-ignore
                    amount: (txn.parsed.info.amount / 1000000).toFixed(2),
                }
                recentTxns.push(ix);
            }
        }
        setParsedTransactions(recentTxns);
    }

    async function getLastLiquiation() {
        const signatures = await connection.getSignaturesForAddress(new PublicKey('6dDCUve96a1Cqw3Zv34wfbCGwU77UEPe13953UdanTnT'), {limit: 1});
        const txn = await connection.getParsedTransaction(signatures[0].signature);
        const timestamp = txn.blockTime;
        const utc = new Date(timestamp * 1000);

        setLastLiquidation({
            // set date to date and time of transaction
            date: utc.toLocaleDateString() + ' ' + utc.toLocaleTimeString(),
            signature: signatures[0].signature,
        });
    }
    
    const renderLPData = () => {
        return(
            <div
                className='flex flex-col justify-center items-center space-y-2 border-2 border-white p-4 gap-4'
            >
                <p>
                    Parcl Liquidity Pool Balance:
                </p>
                <p
                    className='animate-pulse '
                >
                    {usdcBalance} USDC
                </p>
                <p>
                    Recent Contributions:
                </p>
                <div
                    className='flex flex-col justify-center items-center space-y-2'
                >
                    {parsedTransactions && parsedTransactions.map((txn, index) => {
                        return (
                            <div
                                key={index}
                                
                            >
                                <Link
                                    href={`https://solana.fm/tx/${txn.signature}`}
                                    className='flex flex-row justify-center items-center space-x-5 cursor-pointer'
                                    target="_blank"
                                >
                                    <p>
                                    {txn.authority.slice(0, 5)}...{txn.authority.slice(-5)}
                                    </p>
                                    <p>
                                        Amount: {txn.amount}
                                    </p>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    };

    const rendderLastLiquidation = () => {
        return(
            <div
                className='flex flex-col justify-center items-center space-y-2 border-2 border-white p-4 gap-4'
            >
                {lastLiquidation && (
                    <Link
                        href={`https://solana.fm/tx/${lastLiquidation.signature}`}
                        className='flex flex-row justify-center items-center space-x-5 cursor-pointer'
                        target="_blank"
                    >
                        Last Liquiation Occurence: {lastLiquidation.date}
                    </Link>
                )}
            </div>
        )
    };

    const renderMarketData = () => {
        return(
            <div
                className='flex flex-col justify-center items-center space-y-2 border-2 border-white p-4'
            >
                <h4>
                    Market Data
                </h4>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                    onClick={() => {
                        setShowStates(!showStates);
                    }}
                >
                    {!showStates && (
                        <div>
                            Show States
                        </div>
                    )}
                    {showStates && (
                        <div>
                            Hide States
                        </div>
                    )}
                </button>
                {showStates && (
                    <div
                        className='flex flex-col justify-center items-center space-y-2'
                    >
                        {!selectedState && (
                            <div 
                                className='grid grid-cols-4 gap-4'
                             >
                                {
                                    states.map((state, index) => {
                                        return (
                                            <button 
                                                key={index}
                                                // className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                                onClick={() => {
                                                    setSelectedState(state);
                                                }}
                                                // if the state is not NY, disable the button and style it differently
                                                style={{
                                                    backgroundColor: state.abbreviation !== 'NY' ? 'gray' : 'blue',
                                                    color: state.abbreviation !== 'NY' ? 'black' : 'white',
                                                    borderRadius: '5px',
                                                }}
                                                disabled={state.abbreviation !== 'NY' ? true : false}
                                            >
                                                {state.name}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        )}
                        {selectedState && cityData && (
                            <div
                                className='flex flex-col justify-center items-center space-y-2 m-6'
                            >
                                <h1
                                    className='animate-pulse text-4xl font-bold underline mb-4'
                                >
                                    {selectedState.name}
                                </h1>
                                <button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                    onClick={() => {
                                        setSelectedState(null),
                                        setCityData(null);
                                    }}
                                >
                                    Back
                                </button>
                                {!loading && !marketSingles && (
                                    <div
                                        className='flex flex-col gap-4'
                                    >
                                        {
                                            cityData.map((city, index) => {
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedCity(city);
                                                        }}
                                                        disabled={city.parcl_id !== 2900187 ? true : false}
                                                        style={{
                                                            backgroundColor: city.parcl_id !== 2900187 ? 'gray' : 'blue',
                                                            color: city.parcl_id !== 2900187 ? 'black' : 'white',
                                                            borderRadius: '5px',
                                                            width: 'fit-content',
                                                            padding: '5px',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        <h4>{city.name} - {city.location_type}</h4>
                                                    </button>
                                                )
                                            })
                                        }
                                    </div>
                                )}
                                {!loading && marketSingles && (
                                    <div
                                        className='flex flex-col justify-center items-center space-y-2 m-6'
                                    >
                                        <h1>
                                            Single Men: {marketSingles[0]}
                                        </h1>
                                        <h1>
                                            Single Women: {marketSingles[1]}
                                        </h1>
                                        <h1>
                                            Homes for Sale: {marketData}
                                        </h1>
                                    </div>
                                )}
                                {loading && (
                                    <div
                                        className='flex flex-col justify-center items-center space-y-2 m-6'
                                    >
                                        <h1>
                                            Loading...
                                        </h1>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>         
                )}   
            </div>
        )
    }

    useEffect(() => {
        if(!usdcBalance){
            getTokenBalanceWeb3().then((balance) => {
                setUsdcBalance(balance);
            });
            getRecentTransactions();
            getLastLiquiation();
        }
    }, []);


    useEffect(() => {
        if(!selectedState) return;
        const getStateMarkets = async () => {
            console.log('pinging data point: ', `/api/parcl/markets?state=${selectedState.abbreviation}`)
            const response = await fetch(`/api/parcl/markets?state=${selectedState.abbreviation}`);
            const data = await response.json();
            console.log(data);
            setCityData(data);
        }
        getStateMarkets();
    }, [selectedState]);

    useEffect(() => {
        if(!selectedCity) return;
        setLoading(true);

        const getCitySingles = async () => {
            console.log('pinging data point: ', `/api/parcl/single?id=${selectedCity.parcl_id}`)
            const response = await fetch(`/api/parcl/single?id=${selectedCity.parcl_id}`);
            const data = await response.json();
            console.log(data);//{singles_data: Array(2)}
            // the first item in array is men's single population, the 2nd item is female single population
            // destruct the json and set the state
            const {singles_data} = data;
            console.log('singles_data: ', singles_data);
            // for each object in the array, get the value of the first key
            const obj_values = Object.values(singles_data);
            console.log('obj_values: ', obj_values); //[{male_single_population: 3882371}, {female_single_population: 4092451}]
            // extract the values from the array of objects
            const values = obj_values.map(obj => Object.values(obj)[0]);
            console.log('values: ', values); //[3882371, 4092451]
            setMarketSingles(values);
        }
        const getMarketData = async () => {
            console.log('pinging data point: ', `/api/parcl/listings?id=${selectedCity.parcl_id}`)
            const response = await fetch(`/api/parcl/listings?id=${selectedCity.parcl_id}`);
            const data = await response.json();
            console.log(data); //{listings_data: 39193}
            // destruct the json and set the state
            const {listings_data} = data;
            setMarketData(listings_data);
        }

        getCitySingles();
        getMarketData();
        setLoading(false);
    }, [selectedCity]);
   



    return (
        <div
        className='flex flex-col justify-center items-center space-y-2'
        >
            {renderLPData()}
            {rendderLastLiquidation()}
            {renderMarketData()}
        </div>
    )
  }

export default Parcl;