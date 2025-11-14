// Import the functions you need from the SDKs you need
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

import { initializeApp, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  authDomain: "tracker-d2773.firebaseapp.com",

  projectId: "tracker-d2773",

  storageBucket: "tracker-d2773.appspot.com",

  messagingSenderId: "819909330882",

  appId: "1:819909330882:web:ecbda3f81abab383d6385b",

  measurementId: "G-JCSR3CJWWY",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { db, app, auth, database, storage };
