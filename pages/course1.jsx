// ./pages/course1.jsx
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { app } from "../lib/firebase";
import { useUser } from "../context/UserContext"; // Import the useUser hook

// import { getAuth, onAuthStateChanged } from "firebase/auth";

const storage = getStorage(app);
const db = getFirestore(app);

export default function Course1() {
  const router = useRouter();
  const { user } = useUser(); // Get the user object from the context
  const [materials, setMaterials] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [userEmail, setUserEmail] = useState("");
  // const auth = getAuth(app);

  // Fetch course materials
  const fetchMaterials = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "course_materials"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched Materials:", data); // Debug log
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error); // Debug log
    }
  };

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "submissions"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched Submissions:", data); // Debug log
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error); // Debug log
    }
  };

  // Fetch data on page load
  useEffect(() => {
    const fetchData = async () => {
      await fetchMaterials();
      await fetchSubmissions();
      setLoading(false);
    };
    fetchData();
  }, []);

  // // Monitor authentication state
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUserEmail(user.email);
  //       console.log("User Email:", user.email); // Debug log
  //     } else {
  //       setUserEmail("");
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [auth]);

  // Handle student submission
  const handleSubmission = async (materialId, file) => {
    if (!file) return alert("Please select a file");

    try {
      const fileRef = ref(storage, `submissions/${materialId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, "submissions"), {
        materialId,
        studentEmail: user.email, // Ensure this is stored properly
        fileName: file.name,
        fileUrl: url,
        submittedAt: new Date(),
      });

      // Refresh submissions after upload
      await fetchSubmissions();
      alert("Submission uploaded successfully!");
    } catch (error) {
      console.error("Error uploading submission:", error);
      alert("Failed to upload submission.");
    }
  };

  return (
    <div>
      <Head>
        <title>Course 1</title>
      </Head>
      <h1>Course 1</h1>

      {/* List Materials */}
      <h2>Materials</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        materials.map((material) => (
          <Card key={material.id} className="my-2">
            <Card.Body>
              <Card.Title>{material.name}</Card.Title>
              {material.visible ? (
                <>
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Material
                  </a>
                  <br />
                  <br />
                  {/* Student Submission Section */}
                  <h5>Submit Your Answer</h5>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleSubmission(material.id, file);
                      }
                    }}
                  />
                  {/* Display Submissions */}
                  {submissions
                    .filter(
                      (submission) => submission.materialId === material.id
                    )
                    .map((submission) => (
                      <div key={submission.id} className="mt-3">
                        <p>
                          <strong>Your Submission:</strong>{" "}
                          {submission.fileName}
                        </p>
                        <a
                          href={submission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download Submission
                        </a>
                      </div>
                    ))}
                </>
              ) : (
                <p>
                  <i>Hidden from students</i>
                </p>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      <button onClick={() => router.back()}>Back</button>
    </div>
  );
}
