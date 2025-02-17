import CourseNavbar from "./CourseNavbar";
import { useUser } from "../context/UserContext";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { app } from "../lib/firebase";
import { useState, useEffect } from "react";

const db = getFirestore(app);

const CourseLayout = ({ courseId, children }) => {
  const { user } = useUser();
  const [courseLocked, setCourseLocked] = useState(false);
  const [courseExists, setCourseExists] = useState(true);

  useEffect(() => {
    const fetchCourseLockStatus = async () => {
      if (!courseId) return;

      try {
        const courseRef = doc(db, "courses", courseId);
        const courseDoc = await getDoc(courseRef);

        if (courseDoc.exists()) {
          setCourseLocked(courseDoc.data().locked || false);
        } else {
          console.warn(`Course with ID "${courseId}" not found.`);
          setCourseExists(false);
        }
      } catch (error) {
        console.error("Error fetching course lock status:", error);
        setCourseExists(false);
      }
    };

    fetchCourseLockStatus();
  }, [courseId]);

  const handleLockCourse = async (locked) => {
    try {
      if (!courseExists) {
        alert("Error: Cannot lock/unlock a non-existent course.");
        return;
      }

      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, { locked });

      setCourseLocked(locked);
      alert(`Course ${locked ? "locked" : "unlocked"} successfully!`);
    } catch (error) {
      console.error("Error updating course lock status:", error);
      alert("Failed to update course lock status. Please try again.");
    }
  };

  if (!courseExists) {
    return <p style={{ color: "red" }}>Error: Course not found.</p>;
  }

  return (
    <div>
      <CourseNavbar courseId={courseId} />
      <div className="course-content">
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
