import Container from "../constants/Container";
import HorizontalContainer from "../constants/HorizontalContainer";
import Card from "../constants/Card";
import CardContent from "../constants/CardContent";

export default function Overview() {
    return (
        <Container>
            <HorizontalContainer>
                <Card>
                    <CardContent>
                        <h1>Select your Network</h1>
                        {/* TODO: insert 2 buttons, one sets the rpc network to dev, the other mainnet-beta. they will trigger windwow events that cause the header to react */}
                        <p>
                            <b>Current Network: </b>
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <h1>Get Updates for new Games</h1>
                        {/* TODO: insert email link */}
                        <p>
                            <b>Subscribe to our newsletter: </b>
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <h1>Current Solana Stats</h1>
                        {/* TODO: solana fm or helius rpc stat points */}
                        <p>
                            <b>Solana Price: </b>
                        </p>
                    </CardContent>
                </Card> 
            </HorizontalContainer>
        </Container>
    );
}