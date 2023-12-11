// this will be the landing page for the app
import styles from './landing.module.css'
import CardContainer from '../constants/CardContainer'
import Card from '../constants/Card'
import CardContent from '../constants/CardContent'
import LargeContainer from '../constants/LargeContainer'
import Countdown from '../countdown/countdown'
import FlashingHeader from '../constants/FlashingHeader'

export default function Landing() {
    return (
        <>
            <LargeContainer>
                <div className={styles.background}></div>
                <div className={styles.overlay}></div>
                <CardContainer>
                    <FlashingHeader>
                        <h1>Retro Sol</h1>
                    </FlashingHeader>
                    <Countdown />
                    {/* <Card> */}
                        {/* logo image here */}
                        {/* <img src="/img/logo.svg" className="h-6" alt="Tailwind Play" /> */}
                        {/* <CardContent> */}
                            {/* <h1>Retro Sol</h1>
                            <p>Play retro games with your friends</p> */}
                        {/* </CardContent> */}
                    {/* </Card> */}
                </CardContainer>
            </LargeContainer>
        </>
    );
}