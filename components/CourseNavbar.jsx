// components/CourseNavbar.jsx
import { Navbar, Nav, Container } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from 'react';  // Ensure you import useState

export default function CourseNavbar({ courseName }) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);

    const handleSelect = (route) => {
        router.push(route);
        setExpanded(false);  // Collapse the navbar
    };

    return (
        <Navbar expand="md" className="navbar-dark navbar-custom" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
            <Container>
                <Navbar.Brand className="course-navbar-brand">
                    {courseName}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="course-navbar-nav" />
                <Navbar.Collapse id="course-navbar-nav">
                    <Nav className="me-auto">
                        <Link href={`/courses/${router.query.courseId}/announcements`} passHref>
                            <Nav.Link onClick={() => handleSelect(`/courses/${router.query.courseId}/announcements`)}>Announcements</Nav.Link>
                        </Link>
                        <Link href="#grades" passHref>
                            <Nav.Link onClick={() => handleSelect('#grades')}>Grades</Nav.Link>
                        </Link>
                        <Link href="#materials" passHref>
                            <Nav.Link onClick={() => handleSelect('#materials')}>Materials</Nav.Link>
                        </Link>
                        <Link href="#assignments" passHref>
                            <Nav.Link onClick={() => handleSelect('#assignments')}>Assignments</Nav.Link>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
