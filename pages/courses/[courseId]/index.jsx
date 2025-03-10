import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import CourseLayout from "../../../components/common/CourseLayout";
import AddAssignmentForm from "../../../components/Course/AddAssignmentForm";
import MaterialCard from "../../../components/Course/MaterialCard";
import AnnouncementForm from "../../../components/announcements/AnnouncementForm";
import AnnouncementList from "../../../components/announcements/AnnouncementList";
import FormSelector from "../../../components/Common/FormSelector";
import { useCourseData } from "../../../hooks/useCourseData";
import { useAnnouncements } from "../../../hooks/useAnnouncements";
import {
  uploadFile,
  addSubmission,
  updateSubmission,
  addAssignment,
} from "../../../lib/firebaseUtils";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { app } from "../../../lib/firebase";

const db = getFirestore(app);

export default function CoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const { user } = useUser();
  const {
    course,
    materials: initialMaterials,
    submissions,
    loading,
  } = useCourseData(courseId);
  const {
    announcements,
    loading: loadingAnnouncements,
    fetchAnnouncements,
  } = useAnnouncements(courseId);
  const [materials, setMaterials] = useState(initialMaterials);
  const [newAssignment, setNewAssignment] = useState({
    name: "",
    file: null,
    visible: true,
  });
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedSection, setSelectedSection] = useState("materials");

  useEffect(() => {
    setMaterials(initialMaterials);
  }, [initialMaterials]);

  const handleSubmission = async (materialId, file) => {
    if (!file) return alert("Please select a file");

    try {
      const url = await uploadFile(
        `submissions/${materialId}/${file.name}`,
        file
      );
      await addSubmission({
        materialId,
        studentEmail: user.email,
        fileName: file.name,
        fileUrl: url,
        submittedAt: new Date(),
        grade: null,
        feedback: null,
        courseId,
      });
      alert("Submission uploaded successfully!");
    } catch (error) {
      console.error("Error uploading submission:", error);
      alert("Failed to upload submission. Please try again.");
    }
  };

  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    if (!grade || !feedback)
      return alert("Please provide both grade and feedback");

    try {
      await updateSubmission(submissionId, { grade, feedback });
      alert("Grade and feedback submitted successfully!");
    } catch (error) {
      console.error("Error grading submission:", error);
      alert("Failed to submit grade and feedback.");
    }
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.name || !newAssignment.file)
      return alert("Please fill in all fields");

    try {
      const url = await uploadFile(
        `assignments/${newAssignment.file.name}`,
        newAssignment.file
      );
      await addAssignment({
        name: newAssignment.name,
        url,
        visible: newAssignment.visible,
        courseId,
      });
      alert("Assignment added successfully!");
      setNewAssignment({ name: "", file: null, visible: true });
    } catch (error) {
      console.error("Error adding assignment:", error);
      alert("Failed to add assignment. Please try again.");
    }
  };

  const handleToggleVisibility = (id, newVisibility) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.id === id ? { ...material, visible: newVisibility } : material
      )
    );
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      await deleteDoc(doc(db, "announcements", announcementId));
      alert("Announcement deleted successfully!");
      // Refresh announcements after deletion
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement. Please try again.");
    }
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <CourseLayout courseId={courseId}>
      <Head>
        <title>{course?.title}</title>
      </Head>
      <h2 className="material-header">Materials & Announcements</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {user?.title === "professor" && (
            <>
              <FormSelector onSelect={setSelectedForm} />
              {selectedForm === "assignment" && (
                <AddAssignmentForm
                  newAssignment={newAssignment}
                  setNewAssignment={setNewAssignment}
                  handleAddAssignment={handleAddAssignment}
                />
              )}
              {selectedForm === "announcement" && (
                <AnnouncementForm courseId={courseId} />
              )}
              {/* Add other forms here as needed */}
            </>
          )}

          {loadingAnnouncements ? (
            <p>Loading announcements...</p>
          ) : (
            <AnnouncementList
              announcements={announcements}
              user={user}
              onDelete={handleDeleteAnnouncement}
            />
          )}

          {materials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              user={user}
              handleSubmission={handleSubmission}
              handleToggleVisibility={handleToggleVisibility}
              submissions={submissions}
              handleGradeSubmission={handleGradeSubmission}
            />
          ))}
        </>
      )}
      <button className="secondary-button" onClick={() => router.back()}>
        Back
      </button>
    </CourseLayout>
  );
}
