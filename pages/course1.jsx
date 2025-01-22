import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function Course1() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleUpload = () => {
    alert("Document uploaded");
  };

  return (
    <div>
      <Head>
        <title>Course 1</title>
      </Head>
      <h1>Course 1</h1>
      <Card
        className="my-3"
        onClick={() => setOpen(!open)}
        aria-controls="assignment-collapse"
        aria-expanded={open}
      >
        <Card.Body>
          <Card.Title>Assignment 1 {open ? "▲" : "▼"}</Card.Title>
          <Card.Text>Please upload your document for Assignment 1.</Card.Text>
          <Collapse in={open}>
            <div id="assignment-collapse">
              <Button onClick={handleUpload}>Upload Document</Button>
            </div>
          </Collapse>
        </Card.Body>
      </Card>
      <button onClick={() => router.back()}>Back</button>
    </div>
  );
}
