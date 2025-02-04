import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { app } from "../lib/firebase";

const storage = getStorage(app);
const db = getFirestore(app);

export default function Course1() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const fileRef = ref(storage, `course_materials/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    
    await addDoc(collection(db, "course_materials"), {
      name: file.name,
      url,
      visible: false, // Initially hidden
    });

    setFile(null);
    alert("File uploaded successfully");
    fetchMaterials(); // Refresh list
  };

  // Fetch course materials
  const fetchMaterials = async () => {
    const querySnapshot = await getDocs(collection(db, "course_materials"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMaterials(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Toggle visibility
  const toggleVisibility = async (id, currentState) => {
    const docRef = doc(db, "course_materials", id);
    await updateDoc(docRef, { visible: !currentState });
    fetchMaterials();
  };

  return (
    <div>
      <Head>
        <title>Course 1</title>
      </Head>
      <h1>Course 1</h1>

      {/* Upload Section */}
      <Card className="my-3">
        <Card.Body>
          <Card.Title>Upload Course Material</Card.Title>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <Button onClick={handleUpload}>Upload</Button>
        </Card.Body>
      </Card>
      
      {/* List Materials */}
      <h2>Materials</h2>
      {loading ? <p>Loading...</p> : materials.map((material) => (
        <Card key={material.id} className="my-2">
          <Card.Body>
            <Card.Title>{material.name}</Card.Title>
            {material.visible ? (
              <a href={material.url} target="_blank" rel="noopener noreferrer">View</a>
            ) : (
              <p><i>Hidden from students</i></p>
            )}
            <Button onClick={() => toggleVisibility(material.id, material.visible)}>
              {material.visible ? "Hide" : "Show"}
            </Button>
          </Card.Body>
        </Card>
      ))}
      
      <button onClick={() => router.back()}>Back</button>
    </div>
  );
}
