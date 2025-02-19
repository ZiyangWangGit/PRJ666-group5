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
  doc,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { app } from "../../lib/firebase";
import { useUser } from "../../context/UserContext";
import CourseLayout from "../../components/CourseLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const storage = getStorage(app);
const db = getFirestore(app);

export default function CoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAssignment, setNewAssignment] = useState({
    name: "",
    file: null,
    visible: true,
  });

  // Fetch course details
  const fetchCourse = async () => {
    try {
      const courseDoc = await getDoc(doc(db, "courses", courseId));
      if (courseDoc.exists()) {
        setCourse({ id: courseDoc.id, ...courseDoc.data() });
      } else {
        console.error("Course not found");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  // Fetch course materials
  const fetchMaterials = async () => {
    try {
      const q = query(
        collection(db, "course_materials"),
        where("courseId", "==", courseId)
      );
      const querySnapshot = await getDocs(q);
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
      const q = query(
        collection(db, "submissions"),
        where("courseId", "==", courseId)
      );
      const querySnapshot = await getDocs(q);
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
    if (courseId) {
      const fetchData = async () => {
        await fetchCourse();
        await fetchMaterials();
        await fetchSubmissions();
        setLoading(false);
      };
      fetchData();
    }
  }, [courseId]);

  // Handle student submission
  const handleSubmission = async (materialId, file) => {
    if (!file) return alert("Please select a file");

    try {
      // Ensure course exists before proceeding (only for validation purposes)
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) {
        console.error("Course does not exist, submission aborted.");
        return alert("Error: Course not found.");
      }

      // Ensure the file is valid
      if (
        !file.type.startsWith("application/pdf") &&
        !file.type.startsWith("application/msword") &&
        !file.type.startsWith(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
      ) {
        return alert("Only PDF and Word files are allowed.");
      }

      // Upload file to storage
      const fileRef = ref(storage, `submissions/${materialId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      // Add submission to Firestore under the "submissions" collection
      await addDoc(collection(db, "submissions"), {
        materialId,
        studentEmail: user.email,
        fileName: file.name,
        fileUrl: url,
        submittedAt: new Date(),
        grade: null,
        feedback: null,
        courseId, // Linking to existing course
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
    if (!grade || !feedback)
      return alert("Please provide both grade and feedback");

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
    if (!newAssignment.name || !newAssignment.file)
      return alert("Please fill in all fields");

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
        courseId, // Assign courseId to the assignment
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
    <CourseLayout courseId={courseId}>
      <Head>
        <title>{course?.title}</title>
      </Head>
      <h2 className="materal-header">Materials</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Professor Section: Add Assignment */}
          {user?.title === "professor" && (
            <Card className="secondary-card my-3">
              <Card.Body>
                <Card.Title>Add New Assignment</Card.Title>
                <div className="assignmentForm">
                  <input
                    type="text"
                    placeholder="Assignment Name"
                    value={newAssignment.name}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        name: e.target.value,
                      })
                    }
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
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          visible: e.target.checked,
                        })
                      }
                    />
                    &nbsp; Visible to Students
                  </label>
                  <Button
                    className="custom-button"
                    onClick={handleAddAssignment}
                  >
                    Add Assignment
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Display Materials */}
          {materials.map((material) => (
            <Card key={material.id} className="secondary-card my-2">
              <Card.Body>
                <div className="materialCardBody">
                  <Card.Title>{material.name}</Card.Title>
                  {material.visible || user?.title === "professor" ? (
                    <>
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="viewMaterialLink"
                      >
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
                        .filter(
                          (submission) => submission.materialId === material.id
                        )
                        .map((submission) => (
                          <Card key={submission.id} className="submissionCard">
                            <Card.Body>
                              <p>
                                <strong>Submission:</strong>{" "}
                                {submission.fileName}
                                <a
                                  href={submission.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="downloadLink"
                                >
                                  <FontAwesomeIcon icon={faDownload} />
                                </a>
                              </p>
                              {submission.grade && (
                                <p className="highlight">
                                  <strong>Grade:</strong> {submission.grade}
                                </p>
                              )}
                              {submission.feedback && (
                                <p className="highlight">
                                  <strong>Feedback:</strong>{" "}
                                  {submission.feedback}
                                </p>
                              )}
                              {/* Professor Grading Section */}
                              {user?.title === "professor" && (
                                <div className="gradingSection">
                                  <h6>Grade Submission</h6>
                                  <input
                                    type="text"
                                    placeholder="Grade"
                                    className="gradeInput"
                                    onChange={(e) =>
                                      (submission.grade = e.target.value)
                                    }
                                  />
                                  <textarea
                                    placeholder="Feedback"
                                    className="feedbackInput"
                                    onChange={(e) =>
                                      (submission.feedback = e.target.value)
                                    }
                                  />
                                  <button
                                    className="custom-button"
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
                            </Card.Body>
                          </Card>
                        ))}
                    </>
                  ) : (
                    <p>
                      <i>Hidden from students</i>
                    </p>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
      <button className="secondary-button" onClick={() => router.back()}>
        Back
      </button>
    </CourseLayout>
  );
}
