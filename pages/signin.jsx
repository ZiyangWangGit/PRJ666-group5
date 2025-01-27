import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { app, db } from "../lib/firebase";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userSchoolId, setUserSchoolId] = useState("");
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        setUserEmail(user.email);
      } else {
        setIsSignedIn(false);
        setUserEmail("");
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setIsSignedIn(true);
      setUserEmail(user.email);
      await fetchUserData(user.email);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
    }
  };

  const fetchUserData = async (userEmail) => {
    try {
      const querySnapshot = await getDocs(collection(db, "contacts"));
      querySnapshot.forEach((doc) => {
        if (doc.id === userEmail) {
          setUserName(doc.data().name);
          setUserTitle(doc.data().title);
          setUserSchoolId(doc.data().school_id);
        }
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchUserData(userEmail); // Fetch data when user email is set
    }
  }, [userEmail]);

  const handleSubmit = (event) => {
    event.preventDefault();
    signIn(email, password);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsSignedIn(false);
      setUserEmail("");
      setUserName("");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("A password reset link has been sent to your email.");
    } catch (error) {
      setErrorMessage(
        "Failed to send password reset email. Please enter your email address."
      );
    }
  };

  // After successful sign-in, redirect to another page
  const redirectToProfile = () => {
    router.push({
      pathname: "/", // Path to profile page
      query: { id: userSchoolId, name: userName, email: userEmail }, // Pass the user data as query params
    });
  };

  return (
    <MDBContainer
      className="my-5"
      style={{ backgroundColor: "#9A616D", padding: "20px" }}
    >
      {isSignedIn ? (
        <MDBCard>
          <MDBCardBody className="text-center">
            <h1>Welcome, {userName || userEmail || userSchoolId}!</h1>
            <p>
              {userName} ({userTitle}, School ID: {userSchoolId})
            </p>
            <p>You have successfully signed in.</p>
            <MDBBtn color="dark" onClick={redirectToProfile}>
              Go to Profile
            </MDBBtn>
            <br />
            <br />
            <MDBBtn color="dark" onClick={handleLogout}>
              Logout
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      ) : (
        <MDBCard>
          <MDBRow className="g-0">
            <MDBCol md="6">
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                alt="login form"
                className="rounded-start w-100"
              />
            </MDBCol>

            <MDBCol md="6">
              <MDBCardBody className="d-flex flex-column">
                <div className="d-flex flex-row mt-2">
                  <MDBIcon
                    fas
                    icon="cubes fa-3x me-3"
                    style={{ color: "#ff6219" }}
                  />
                  <span className="h1 fw-bold mb-0">Logo</span>
                </div>

                <h5
                  className="fw-normal my-4 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Sign into your account
                </h5>

                <form onSubmit={handleSubmit}>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email address"
                    id="email"
                    type="email"
                    size="lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Password"
                    id="password"
                    type="password"
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                  <MDBBtn
                    className="mb-4 px-5"
                    color="dark"
                    size="lg"
                    type="submit"
                  >
                    Login
                  </MDBBtn>
                </form>
                <a
                  className="small text-muted"
                  onClick={handlePasswordReset}
                  style={{ cursor: "pointer" }}
                >
                  Forgot password?
                </a>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      )}
    </MDBContainer>
  );
};

export default SignIn;
