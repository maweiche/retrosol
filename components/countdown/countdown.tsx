'use client';
import { useState, useEffect } from 'react';
import styles from './countdown.module.css'
export default function Countdown() {

    const [time, setTime] = useState(0);

    useEffect(() => {
        // get the current time
        const currentTime = new Date();
        // get the hackathon start time
        const hackathonStartTime = new Date("1/31/2024 9:00:00 AM");
        // get the difference between the two
        const difference = hackathonStartTime.getTime() - currentTime.getTime();
        console.log(difference);
        // set the state to the difference
        setTime(difference);
        // update the state every second
        const interval = setInterval(() => {
            setTime(time => time - 1000);
        }, 1000);
        // cleanup function
        return () => clearInterval(interval);
    }
    , []);

    // convert the time to days, hours, minutes, seconds
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return (
        <div className={styles.countdown_timer}>
            <p>{days}:{hours}:{minutes}:{seconds}</p>
            

        </div>
    );
}

