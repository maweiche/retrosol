// this will be the landing page for the app
import styles from './landing.module.css'
import CardContainer from '../constants/CardContainer'
import Card from '../constants/Card'
import CardContent from '../constants/CardContent'
import LargeContainer from '../constants/LargeContainer'
import FlashingHeader from '../constants/FlashingHeader'
import dynamic from 'next/dynamic';
require('@solana/wallet-adapter-react-ui/styles.css');


const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
    { ssr: false }
  )

export default function Landing() {
    return (
        <LargeContainer>
            <div className={styles.overlay}>
                <CardContainer>
                    <FlashingHeader>
                        <h1>Retro Sol</h1>
                    </FlashingHeader>                    
                </CardContainer>
            </div>
        </LargeContainer>
    );
}