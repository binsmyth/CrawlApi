// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUGyFjBk1BIiKzFS0ESuwdJahLvR2njqM",
  authDomain: "crawl-jobs-5b75b.firebaseapp.com",
  projectId: "crawl-jobs-5b75b",
  storageBucket: "crawl-jobs-5b75b.appspot.com",
  messagingSenderId: "872160547191",
  appId: "1:872160547191:web:63d7b6a6cddf4ccead1172",
  measurementId: "G-YCR5NF69FX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);