// components/CourseLayout.jsx
import CourseNav from "./CourseNavbar"; // your navbar component

const CourseLayout = ({ courseName, children }) => {
  return (
    <div>
      <CourseNav courseName={courseName} />
      <div className="course-content">{children}</div>
    </div>
  );
};

export default CourseLayout;
