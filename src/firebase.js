// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdJ0COULv0EEAfW_LH8IN1lUAGmHu3Rpk",
  authDomain: "pdfengine-472a8.firebaseapp.com",
  projectId: "pdfengine-472a8",
  storageBucket: "pdfengine-472a8.appspot.com",
  messagingSenderId: "1140024287",
  appId: "1:1140024287:web:805b5a2f363b3773195a6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export { db, app };
