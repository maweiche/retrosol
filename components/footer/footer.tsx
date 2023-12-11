import Container from '../constants/Container'
import FullWidthCard from '../constants/FullWidthCard'
import HorizontalContainer from '../constants/HorizontalContainer';
import Card from '../constants/Card';
import CardContent from '../constants/CardContent';

export default function Footer() {
    return (
        // <FullWidthCard>
            <div 
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '1rem',
                    textAlign: 'center',
                    backgroundColor:'#7B1FA2',
                    color: 'white'
                }}
            >
                <p>© 2021 Retro Game Party</p>
                <p>Made by Matt w/ 🍕 & ❤️</p>
                <p>Terms of Service</p>
            </div>
        // </FullWidthCard>
    );
}   