// ./pages/course2.jsx
import dynamic from "next/dynamic";

const CoursePage = dynamic(() => import("../components/CoursePage"), {
  ssr: false, // Disable server-side rendering
});

export default function Course2() {
  return <CoursePage courseName="Course 2" />;
}