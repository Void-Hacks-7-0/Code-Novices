// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrJW9rn5XaTQMWCbzNZhFGrC1bqUaytmg",
  authDomain: "svvv-e7515.firebaseapp.com",
  projectId: "svvv-e7515",
  storageBucket: "svvv-e7515.firebasestorage.app",
  messagingSenderId: "334676978890",
  appId: "1:334676978890:web:fa00949314f80f565d9833",
  measurementId: "G-JQM65E3RVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAuth(app);

export const auth = getAuth(app);


