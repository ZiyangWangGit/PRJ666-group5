// ./pages/course1.jsx
import dynamic from "next/dynamic";

const CoursePage = dynamic(() => import("../components/CoursePage"), {
  ssr: false, // Disable server-side rendering
});

export default function Course1() {
  return <CoursePage courseName="Course 1" />;
}