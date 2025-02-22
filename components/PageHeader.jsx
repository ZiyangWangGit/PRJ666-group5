import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";

export default function PageHeader({ text }) {
  return (
    <>
      <Container>
        <h1 className="page-header">{text}</h1>
      </Container>
      <br />
    </>
  );
}
