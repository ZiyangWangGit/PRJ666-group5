import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router"; // Import useRouter
import app from "../lib/firebase";  // Adjust path as needed

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);  // Track sign-in state
  const auth = getAuth(app);  // Firebase auth instance
  const router = useRouter();  // Initialize useRouter

  // Firebase auth state listener to handle user sign-in state persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);  // If user is signed in, update state
      } else {
        setIsSignedIn(false);  // If user is signed out, reset state
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [auth]);

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Signed in as:", user.email);

      // Redirect to the homepage or any other route after successful sign-in
      router.push("/");  // Use router.push to navigate
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in:", errorCode, errorMessage);
      setErrorMessage(errorMessage); // Display error to user
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    signIn(email, password);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Signed out");
      setIsSignedIn(false);  // Update sign-in state
      router.push("/");  // Redirect to the profile page after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      {!isSignedIn ? (
        <>
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <button type="submit">Sign In</button>
          </form>
        </>
      ) : (
        <div>
          <h2>Welcome, you are signed in!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default SignIn;
