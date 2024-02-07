import { Container } from "react-bootstrap";
import Card from 'react-bootstrap/Card';

export default function PageHeader({text}) {
    return (
        <>
        <Container>
            <Card className="bg-light">
            <Card.Body>
               { text }
            </Card.Body>
            </Card>
        </Container>
        <br/>
        </>
    )
}