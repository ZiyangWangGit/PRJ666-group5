import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import { app } from "../lib/firebase";
import { useUser } from "../context/UserContext";
import CourseLayout from "../components/CourseLayout";

const storage = getStorage(app);
const db = getFirestore(app);

export default function CoursePage({ courseName }) {
  const router = useRouter();
  const { user } = useUser();
  const [materials, setMaterials] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAssignment, setNewAssignment] = useState({ name: "", file: null, visible: true });

  // Fetch course materials
  const fetchMaterials = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "course_materials"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched Materials:", data);
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
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
      console.log("Fetched Submissions:", data);
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
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

  // Handle student submission
  const handleSubmission = async (materialId, file) => {
    if (!file) return alert("Please select a file");

    try {
      // Ensure the file is valid
      if (!file.type.startsWith("application/pdf") && !file.type.startsWith("application/msword") && !file.type.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
        return alert("Only PDF and Word files are allowed.");
      }

      const fileRef = ref(storage, `submissions/${materialId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, "submissions"), {
        materialId,
        studentEmail: user.email,
        fileName: file.name,
        fileUrl: url,
        submittedAt: new Date(),
        grade: null,
        feedback: null,
      });

      // Refresh submissions after upload
      await fetchSubmissions();
      alert("Submission uploaded successfully!");
    } catch (error) {
      console.error("Error uploading submission:", error);
      alert("Failed to upload submission. Please try again.");
    }
  };

  // Handle grading by professor
  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    if (!grade || !feedback) return alert("Please provide both grade and feedback");

    try {
      const submissionRef = doc(db, "submissions", submissionId);
      await updateDoc(submissionRef, {
        grade,
        feedback,
      });

      // Refresh submissions after grading
      await fetchSubmissions();
      alert("Grade and feedback submitted successfully!");
    } catch (error) {
      console.error("Error grading submission:", error);
      alert("Failed to submit grade and feedback.");
    }
  };

  // Handle adding new assignment by professor
  const handleAddAssignment = async () => {
    if (!newAssignment.name || !newAssignment.file) return alert("Please fill in all fields");

    try {
      // Upload the assignment file
      const fileRef = ref(storage, `assignments/${newAssignment.file.name}`);
      await uploadBytes(fileRef, newAssignment.file);
      const url = await getDownloadURL(fileRef);

      // Add the assignment to Firestore
      await addDoc(collection(db, "course_materials"), {
        name: newAssignment.name,
        url,
        visible: newAssignment.visible,
      });

      // Refresh materials after adding
      await fetchMaterials();
      alert("Assignment added successfully!");
      setNewAssignment({ name: "", file: null, visible: true });
    } catch (error) {
      console.error("Error adding assignment:", error);
      alert("Failed to add assignment. Please try again.");
    }
  };

  // Ensure user is loaded before rendering
  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <CourseLayout courseName={courseName}>
      <Head>
        <title>{courseName}</title>
      </Head>
      <h2>Materials</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Professor Section: Add Assignment */}
          {user?.title === "professor" && (
            <Card className="my-3">
              <Card.Body>
                <Card.Title>Add New Assignment</Card.Title>
                <input
                  type="text"
                  placeholder="Assignment Name"
                  value={newAssignment.name}
                  onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })}
                />
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewAssignment({ ...newAssignment, file });
                    }
                  }}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={newAssignment.visible}
                    onChange={(e) => setNewAssignment({ ...newAssignment, visible: e.target.checked })}
                  />
                  Visible to Students
                </label>
                <Button onClick={handleAddAssignment}>Add Assignment</Button>
              </Card.Body>
            </Card>
          )}

          {/* Display Materials */}
          {materials.map((material) => (
            <Card key={material.id} className="my-2">
              <Card.Body>
                <Card.Title>{material.name}</Card.Title>
                {material.visible || user?.title === "professor" ? (
                  <>
                    <a href={material.url} target="_blank" rel="noopener noreferrer">
                      View Material
                    </a>
                    <br />
                    <br />
                    {/* Student Submission Section */}
                    {user?.title === "student" && (
                      <>
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
                      </>
                    )}
                    {/* Display Submissions */}
                    {submissions
                      .filter((submission) => submission.materialId === material.id)
                      .map((submission) => (
                        <div key={submission.id} className="mt-3">
                          <p>
                            <strong>Your Submission:</strong> {submission.fileName}
                          </p>
                          <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                            Download Submission
                          </a>
                          {submission.grade && (
                            <p>
                              <strong>Grade:</strong> {submission.grade}
                            </p>
                          )}
                          {submission.feedback && (
                            <p>
                              <strong>Feedback:</strong> {submission.feedback}
                            </p>
                          )}
                          {/* Professor Grading Section */}
                          {user?.title === "professor" && (
                            <div className="mt-3">
                              <h6>Grade Submission</h6>
                              <input
                                type="text"
                                placeholder="Grade"
                                onChange={(e) => (submission.grade = e.target.value)}
                              />
                              <textarea
                                placeholder="Feedback"
                                onChange={(e) => (submission.feedback = e.target.value)}
                              />
                              <button
                                onClick={() =>
                                  handleGradeSubmission(
                                    submission.id,
                                    submission.grade,
                                    submission.feedback
                                  )
                                }
                              >
                                Submit Grade
                              </button>
                            </div>
                          )}
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
          ))}
        </>
      )}
      <button onClick={() => router.back()}>Back</button>
    </CourseLayout>
  );
}