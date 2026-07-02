// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh4NUvk4O9JhIQ1MPhSP4MAf2qasYLCQ8",
  authDomain: "adaply-2.firebaseapp.com",
  projectId: "adaply-2",
  storageBucket: "adaply-2.firebasestorage.app",
  messagingSenderId: "113301208333",
  appId: "1:113301208333:web:161e2008bd12de63a64444"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
