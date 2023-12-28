import Container from '../constants/Container'
import FullWidthCard from '../constants/FullWidthCard'
import BlackGridContainer from '../constants/BlackGridContainer';
import VerticalImageCard from '../constants/VerticalImageCard';
import HorizontalImageCard from '../constants/HorizontalImageCard';
import Link from 'next/link';
import Image from 'next/image';
import styles from './showcase.module.css';

export default function Showcase() {
    return (
        <BlackGridContainer>
            <Link href='/hangman'>
                <VerticalImageCard>
                    <h1>Hangman</h1>
                    <Image 
                        src="/hangman_display.png" 
                        alt="Hangman"
                        height={300}
                        width={300}
                    />
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
                <Image
                    src="/guess_who_display.png" 
                    alt="Guess Who"
                    height={300}
                    width={300}
                />
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
            <Link 
                href='/mancala'
                style={{
                    height: '100%',
                    width: '100%',
                }}
            >
                <HorizontalImageCard>
                    <h1>Mancala</h1>
                    <Image 
                        src="/mancala_display.png" 
                        alt="Mancala"
                        height={600}
                        width={300}
                    />
                     <h1
                        style={{
                            color: '#00ff00',
                        }}
                    >
                        Live - Devnet
                    </h1>
                </HorizontalImageCard>
            </Link>
            <VerticalImageCard>
                <h1>Battleship</h1>
                <Image 
                    src="/battleship_display.png" 
                    alt="Battleship" 
                    height={300}
                    width={300}
                />
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