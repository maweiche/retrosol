import Container from '../constants/Container'
import FullWidthCard from '../constants/FullWidthCard'
import BlackGridContainer from '../constants/BlackGridContainer';
import VerticalImageCard from '../constants/VerticalImageCard';
import HorizontalImageCard from '../constants/HorizontalImageCard';

export default function Showcase() {
    return (
        <BlackGridContainer>
            <VerticalImageCard>
                <h1>Hangman</h1>
                <img src="/hangman_display.png" alt="Landing Page 1" />
            </VerticalImageCard>
            <HorizontalImageCard>
                <h1>Guess Who</h1>
                <img src="/guess_who_display.png" alt="Landing Page 2" />
            </HorizontalImageCard>
            <HorizontalImageCard>
                <h1>Mancala</h1>
                <img src="/mancala_display.png" alt="Landing Page 3" />
            </HorizontalImageCard>
            <VerticalImageCard>
                <h1>Battleship</h1>
                <img src="/battleship_display.png" alt="Landing Page 4" />
            </VerticalImageCard>
        </BlackGridContainer>
    );
}