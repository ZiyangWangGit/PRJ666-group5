// ./components/SubmissionUpload.jsx
import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../lib/firebase";

const storage = getStorage(app);
const db = getFirestore(app);

export default function SubmissionUpload({ courseId, assignmentId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setLoading(true);
    try {
      const fileRef = ref(storage, `submissions/${courseId}/${assignmentId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, "submissions"), {
        courseId,
        assignmentId,
        fileName: file.name,
        fileUrl: url,
        submittedAt: new Date(),
      });

      setMessage("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="my-3">
      <Card.Body>
        <Card.Title>Submit Assignment</Card.Title>
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload your submission</Form.Label>
            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
          </Form.Group>
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </Form>
        {message && <p>{message}</p>}
      </Card.Body>
    </Card>
  );
}