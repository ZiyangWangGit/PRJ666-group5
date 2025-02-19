// ./components/CourseNav.jsx
import { Navbar, Nav, Container } from "react-bootstrap";
import Link from "next/link";
import { useState } from "react";

export default function CourseNavbar({ courseName }) {
  const [expanded, setExpanded] = useState(false);

  const handleSelect = () => {
    setExpanded(false); // Collapse the navbar
  };

  return (
    // <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
    <Navbar
      expand="md"
      className="navbar-dark navbar-custom"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      style={{ borderRadius: "0.5rem" }}
    >
      <Container>
        <Navbar.Brand className="course-navbar-brand">
          {courseName}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="course-navbar-nav" />
        <Navbar.Collapse id="course-navbar-nav">
          <Nav className="me-auto">
            <Link
              href="#announcements"
              passHref
              style={{ textDecoration: "none" }}
            >
              <Nav.Link onClick={handleSelect}>Announcements</Nav.Link>
            </Link>
            <Link href="#grades" passHref style={{ textDecoration: "none" }}>
              <Nav.Link onClick={handleSelect}>Grades</Nav.Link>
            </Link>
            <Link href="#materials" passHref style={{ textDecoration: "none" }}>
              <Nav.Link onClick={handleSelect}>Materials</Nav.Link>
            </Link>
            <Link
              href="#assignments"
              passHref
              style={{ textDecoration: "none" }}
            >
              <Nav.Link onClick={handleSelect}>Assignments</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
