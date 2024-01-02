/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from "react";
import { useEffect, useState } from "react";
import { states } from "./states";

const Parcl = () => {
    const [loading, setLoading] = useState(false);

    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [cityData, setCityData] = useState(null);

    const [marketSingles, setMarketSingles] = useState(null); 
    const [marketData, setMarketData] = useState(null);

    useEffect(() => {
        console.log(
            'selectedState: ', selectedState,
        )
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
        console.log(
            'selectedCity: ', selectedCity,
        )
        if(!selectedCity) return;
        setLoading(true);

        const getCitySingles = async () => {
            console.log('pinging data point: ', `/api/parcl/single?id=${selectedCity.parcl_id}`)
            const response = await fetch(`/api/parcl/single?id=${selectedCity.parcl_id}`);
            const data = await response.json();
            console.log(data);
            setMarketSingles(data);
        }
        const getMarketData = async () => {
            console.log('pinging data point: ', `/api/parcl/listings?id=${selectedCity.parcl_id}`)
            const response = await fetch(`/api/parcl/listings?id=${selectedCity.parcl_id}`);
            const data = await response.json();
            console.log(data);
            setMarketData(data);
        }

        getCitySingles();
        getMarketData();
        setLoading(false);
    }, [selectedCity]);
   



    return (
      <div
        // use tailwind classes here, style the background color to white
        className='flex flex-col justify-center items-center space-y-2'
      >
            {selectedState && !selectedCity &&(
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
                            setSelectedState(null);
                        }}
                    >
                        Back
                    </button>
                </div>
            )}
            {!selectedState && (
            <div 
               className='grid grid-cols-4 gap-4'
            >
                {
                    states.map((state, index) => {
                        return (
                            <button 
                                key={index}
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                onClick={() => {
                                    setSelectedState(state);
                                }}
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
                            className='grid grid-cols-4 gap-4'
                        >
                            {
                                cityData.map((city, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className='grid grid-cols-4 gap-4'
                                        >
                                            <button
                                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-64'
                                                onClick={() => {
                                                    setSelectedCity(city);
                                                }}
                                            >
                                                {city.name}
                                            </button>
                                        </div>
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
                                Single Men: {marketSingles.male_single_population}
                            </h1>
                            <h1>
                                Single Women: {marketSingles.female_single_population}
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
    )
  }

export default Parcl;