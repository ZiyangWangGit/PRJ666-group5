import { Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MainNav() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ id: "", name: "", email: "" });

  useEffect(() => {
    if (router.query.id && router.query.name && router.query.email) {
      setUserInfo({
        id: router.query.id,
        name: router.query.name,
        email: router.query.email,
      });
    }
  }, [router.query]);

  return (
    <>
      {/* Navbar component with dark theme and fixed to the top */}
      <Navbar expand="lg" className="fixed-top navbar-dark bg-dark">
        <Container>
          {/* Navbar brand name */}
          <Navbar.Brand>SAUCE</Navbar.Brand>
          {/* Toggle button for collapsing the navbar on smaller screens */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {/* Collapsible navbar content */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Link to the Profile page */}
              <Link
                href={`/?id=${userInfo.id}&name=${userInfo.name}&email=${userInfo.email}`}
                passHref
                legacyBehavior
              >
                <Nav.Link>Profile</Nav.Link>
              </Link>
              {/* Link to the Courses page */}
              <Link href="/courses" passHref legacyBehavior>
                <Nav.Link>Courses</Nav.Link>
              </Link>
              <Link href="/signin" passHref legacyBehavior>
                <Nav.Link>Signin</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Spacing to ensure content is not hidden behind the fixed navbar */}
      <br />
      <br />
    </>
  );
}
