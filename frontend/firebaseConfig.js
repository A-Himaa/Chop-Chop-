import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage" ;

const firebaseConfig = {
  apiKey: "AIzaSyAFwbj5uNtkybIGrJkfe8tFDiCEOXLdiwM",
  authDomain: "chop-chop---paf.firebaseapp.com",
  projectId: "chop-chop---paf",
  storageBucket: "chop-chop---paf.firebasestorage.app",
  messagingSenderId: "309970204358",
  appId: "1:309970204358:web:8b477553ac6d51d73389c7",
  measurementId: "G-Q98XXRZ6JB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
