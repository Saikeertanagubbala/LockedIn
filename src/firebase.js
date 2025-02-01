// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChlhWk1rRJAfx-CVeFAaUoOQjfoGORi-U",
  authDomain: "lockedin-38d6f.firebaseapp.com",
  projectId: "lockedin-38d6f",
  storageBucket: "lockedin-38d6f.firebasestorage.app",
  messagingSenderId: "664097417596",
  appId: "1:664097417596:web:d2eb68e77e660166dc5cf9",
  measurementId: "G-3E77QTRBTC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

//const analytics = getAnalytics(app);
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };