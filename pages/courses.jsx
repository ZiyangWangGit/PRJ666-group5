import { useState } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { Card, Col, Row } from "react-bootstrap";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Courses() {
  const router = useRouter();
  let [page, setPage] = useState(1);

  // Function to handle the previous page button click
  const previous = () => {
    page > 1 && setPage(--page);
  };

  // Array of static course objects
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
      <h1>Courses</h1>
      <Row xs={1} md={2} className="g-4">
        {courses.map((course) => (
          <Col key={course.id}>
            {/* Card component for each course */}
            <Card
              className={`h-100 ${course.locked ? "locked-card" : ""}`}
              onClick={() => !course.locked && router.push(course.url)}
              style={{ cursor: course.locked ? "not-allowed" : "pointer" }}
            >
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                {course.locked && <Card.Text>(Locked)</Card.Text>}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <br />
      {/* Pagination buttons */}
      <button onClick={previous}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}