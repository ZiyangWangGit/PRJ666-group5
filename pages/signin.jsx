import React, { useState, useEffect } from "react";
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
  MDBRow,
  MDBCol,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';

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
    <div>
      <style>
        {`
          body {
            /* fallback for old browsers */
            background: #6a11cb;
            /* Chrome 10-25, Safari 5.1-6 */
            background: -webkit-linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1));
            /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            background: linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1));
          }
        `}
      </style>
      <MDBContainer fluid>
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
          <MDBRow className="g-0 d-flex justify-content-center align-items-center h-100">
            <MDBCol md="6">
              <MDBCard className="bg-dark text-white my-5 mx-auto" style={{borderRadius: '1rem', maxWidth: '400px'}}>
                <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-5">Please enter your login and password!</p>

                  <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' id='formControlLg' type='email' size="lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='formControlLg' type='password' size="lg" value={password} onChange={(e) => setPassword(e.target.value)} required />

                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  <p className="small mb-3 pb-lg-2"><a className="text-white-50" onClick={handlePasswordReset} style={{ cursor: "pointer" }}>Forgot password?</a></p>
                  <MDBBtn 
                    className="fw-bold mb-2 text-uppercase"
                    onClick={handleSubmit}
                  >
                    Login
                  </MDBBtn>




                  <div className='d-flex flex-row mt-3 mb-5'>
                    <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                      <MDBIcon fab icon='facebook-f' size="lg" />
                    </MDBBtn>

                    <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                      <MDBIcon fab icon='twitter' size="lg" />
                    </MDBBtn>

                    <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                      <MDBIcon fab icon='google' size="lg" />
                    </MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        )}
      </MDBContainer>
    </div>
  );
};

export default SignIn;
