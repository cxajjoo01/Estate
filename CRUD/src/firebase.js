// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-estate-91a7d.firebaseapp.com",
  projectId: "mern-estate-91a7d",
  storageBucket: "mern-estate-91a7d.appspot.com",
  messagingSenderId: "443224723651",
  appId: "1:443224723651:web:8e47f076e7059445f5d276"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);