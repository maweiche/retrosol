import LargeContainer from "../constants/LargeContainer";
import GridContainer from "../constants/GridContainer";
import FullWidthCard from "../constants/FullWidthCard";
import Card from "../constants/Card";
import CardContent from "../constants/CardContent";

export default function Faq() {
    return (
        <div
            style={{
                backgroundColor: '#FF8800',
                color: '#333333',
                width: '100%',
                height: 'fit-content',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* <FullWidthCard> */}
                <GridContainer>
                    <Card>
                        <CardContent>
                            <h1>What Blockchain is this built on?</h1>
                            <p>
                                This is built on Solana, a high-performance / low-fee blockchain.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <h1>Why build on Solana?</h1>
                            <p>
                                Solana is a high-performance blockchain that can handle thousands of transactions per second, and with the blockchain acting as a database
                                no need to worry about setting up a backend.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <h1>What games are you planning on building?</h1>
                            <p>
                                We are focused on building the classic style games you would play with or against your friends. Games like Hangman, Mancala, and Battleship.
                            </p>
                        </CardContent>
                    </Card> 
                    <Card>
                        <CardContent>
                            <h1>How can I play?</h1>
                            <p>
                                Right Hangman is available on Devnet, after we finish testing we will be moving to Mainnet Beta.
                            </p>
                        </CardContent>
                    </Card>
                </GridContainer>
            {/* </FullWidthCard> */}
        </div>
    );
}