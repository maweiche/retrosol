import Container from '../constants/Container'
import FullWidthCard from '../constants/FullWidthCard'
import BlackGridContainer from '../constants/BlackGridContainer';
import VerticalImageCard from '../constants/VerticalImageCard';
import HorizontalImageCard from '../constants/HorizontalImageCard';
import Link from 'next/link';
import styles from './showcase.module.css';

export default function Showcase() {
    return (
        <BlackGridContainer>
            <Link href='/hangman'>
                <VerticalImageCard>
                    <h1>Hangman</h1>
                    <img src="/hangman_display.png" alt="Landing Page 1" />
                    <h1
                        style={{
                            // color: 'green'
                            color: '#00ff00',
                        }}
                    >
                        Live - Devnet
                    </h1>
                </VerticalImageCard>
            </Link>
            <HorizontalImageCard>
                <h1>Guess Who</h1>
                <img src="/guess_who_display.png" alt="Landing Page 2" />
                <h1
                    style={{
                        color: 'red',
                        transform: 'rotate(-30deg)',
                        fontSize: '2.5rem',
                        border: '4px solid red',
                    }}
                >
                    Coming Soon
                </h1>
            </HorizontalImageCard>
            <HorizontalImageCard>
                <h1>Mancala</h1>
                <img src="/mancala_display.png" alt="Landing Page 3" />
                <h1
                    style={{
                        color: 'red',
                        transform: 'rotate(-30deg)',
                        fontSize: '2.5rem',
                        border: '4px solid red',
                    }}
                >
                    Coming Soon
                </h1>
            </HorizontalImageCard>
            <VerticalImageCard>
                <h1>Battleship</h1>
                <img src="/battleship_display.png" alt="Landing Page 4" />
                <h1
                    style={{
                        color: 'red',
                        transform: 'rotate(-30deg)',
                        fontSize: '2.5rem',
                        border: '4px solid red',
                    }}
                >
                    Coming Soon
                </h1>
            </VerticalImageCard>
        </BlackGridContainer>
    );
}