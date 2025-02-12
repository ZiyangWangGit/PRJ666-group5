// ./components/CourseLayout.jsx
import CourseNav from "./CourseNavbar";
import { useUser } from "../context/UserContext";
import { getFirestore, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../lib/firebase";
import { useState, useEffect } from "react";

const db = getFirestore(app);

const CourseLayout = ({ courseName, children }) => {
  const { user } = useUser();
  const [courseLocked, setCourseLocked] = useState(false);

  // Fetch course lock status on page load
  useEffect(() => {
    const fetchCourseLockStatus = async () => {
      try {
        const courseRef = doc(db, "courses", courseName);
        const courseDoc = await getDoc(courseRef);
        if (courseDoc.exists()) {
          setCourseLocked(courseDoc.data().locked || false);
        } else {
          // Create the course document if it doesn't exist
          await setDoc(courseRef, { locked: false });
          setCourseLocked(false);
        }
      } catch (error) {
        console.error("Error fetching course lock status:", error);
      }
    };

    fetchCourseLockStatus();
  }, [courseName]);

  // Handle locking/unlocking course by professor
  const handleLockCourse = async (locked) => {
    try {
      const courseRef = doc(db, "courses", courseName);
      await updateDoc(courseRef, {
        locked,
      });

      setCourseLocked(locked);
      alert(`Course ${locked ? "locked" : "unlocked"} successfully!`);
    } catch (error) {
      console.error("Error updating course lock status:", error);
      alert("Failed to update course lock status. Please try again.");
    }
  };

  return (
    <div>
      <CourseNav courseName={courseName} />
      <div className="course-content">
        {/* Lock/Unlock Course Button for Professors */}
        {user?.title === "professor" && (
          <button
            onClick={() => handleLockCourse(!courseLocked)}
            style={{ margin: "10px" }}
          >
            {courseLocked ? "Unlock Course" : "Lock Course"}
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default CourseLayout;