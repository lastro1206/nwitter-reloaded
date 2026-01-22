import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBY7h9PqTw6H9jAE4HbweZogpwmvdzMkvw",
  authDomain: "nwitter-reloaded-8d615.firebaseapp.com",
  projectId: "nwitter-reloaded-8d615",
  storageBucket: "nwitter-reloaded-8d615.firebasestorage.app",
  messagingSenderId: "242037877610",
  appId: "1:242037877610:web:e5988083eed0ce71825313",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
