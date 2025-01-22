import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB7c0jkxqWzE6tOQ_OIP5imppyRmPqRYpw",
  authDomain: "prj666-e85c0.firebaseapp.com",
  projectId: "prj666-e85c0",
  storageBucket: "prj666-e85c0.firebasestorage.app",
  messagingSenderId: "215062401596",
  appId: "1:215062401596:web:10c844b6f8e186d93ba939",
  measurementId: "G-VQR6M0946X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported in the environment
let analytics;
if (typeof window !== "undefined" && isSupported()) {
  analytics = getAnalytics(app);
}

export { app, analytics };
