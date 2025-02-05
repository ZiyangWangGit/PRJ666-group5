import { Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

export default function MainNav() {
  const router = useRouter();
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState({ id: "", name: "", email: "" });
  const [expanded, setExpanded] = useState(false);

  // useEffect(() => {
  //   if (router.query.id && router.query.name && router.query.email) {
  //     setUserInfo({
  //       id: router.query.id,
  //       name: router.query.name,
  //       email: router.query.email,
  //     });
  //   }
  // }, [router.query]);

  const handleSelect = () => {
    setExpanded(false); // Collapse the navbar
  };

  return (
    <>
      <Navbar
        expand="sm"
        className="fixed-top navbar-dark navbar-custom"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <Navbar.Brand
            className="navbar-brand-custom"
            onClick={() => {
              router.push("/");
              handleSelect();
            }}
          >
            <Image
              src="/images/sauce_bottle.png"
              alt="Sauce Bottle"
              width={30}
              height={30}
            />
            SAUCE
          </Navbar.Brand>
          {/* Toggle button for collapsing the navbar on smaller screens */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {/* Collapsible navbar content */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Link to the Profile page */}
              <Link href={"/"} passHref legacyBehavior>
                <Nav.Link onClick={handleSelect}>Profile</Nav.Link>
              </Link>
              {/* Link to the Courses page */}
              <Link href="/courses" passHref legacyBehavior>
                <Nav.Link onClick={handleSelect}>Courses</Nav.Link>
              </Link>
              {/* Link to the Signin page */}
              <Link href="/signin" passHref legacyBehavior>
                <Nav.Link onClick={handleSelect}>
                  {user ? "Signout" : "Signin"}
                </Nav.Link>
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
