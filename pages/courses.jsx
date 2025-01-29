import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { Card, Col, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../lib/firebase"; // Import your Firebase configuration

const inter = Inter({ subsets: ["latin"] });

export default function Courses() {
  const router = useRouter();
  const [page, setPage] = useState(1); // Pagination state
  const [userEmail, setUserEmail] = useState(""); // User's email state
  const [isSignedIn, setIsSignedIn] = useState(false); // Authentication state
  const auth = getAuth(app);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        setUserEmail(user.email);
      } else {
        setIsSignedIn(false);
        setUserEmail("");
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [auth]);

  // Function to handle the previous page button click
  const previous = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // Static array of course objects
  const courses = [
    {
      id: 1,
      title: "Course 1",
      description: "Description for Course 1",
      url: "/course1",
      locked: false,
    },
    {
      id: 2,
      title: "Course 2",
      description: "Description for Course 2",
      url: "/course2",
      locked: true,
    },
    // Add more courses as needed
  ];

  return (
    <div>
      <Head>
        <title>Courses</title>
      </Head>
      <h1 className={inter.className}>Courses</h1>
      <Row xs={1} md={2} className="g-4">
        {courses.map((course) => (
          <Col key={course.id}>
            <Card
              className={`h-100 ${
                course.locked && userEmail !== "12345@gmail.com"
                  ? "locked-card"
                  : ""
              }`}
              onClick={() =>
                (!course.locked || userEmail === "12345@gmail.com") &&
                router.push(course.url)
              }
              style={{
                cursor:
                  course.locked && userEmail !== "12345@gmail.com"
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                {course.locked && userEmail === "12345@gmail.com" && (
                  <Card.Text>(Not visible to students)</Card.Text>
                )}
                {course.locked && userEmail !== "12345@gmail.com" && (
                  <Card.Text>(Locked)</Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <br />
      {/* Pagination buttons */}
      <div>
        <button onClick={previous} disabled={page <= 1}>
          Previous
        </button>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
}
