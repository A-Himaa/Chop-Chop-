// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// const firebaseConfig = {
//   apiKey: "AIzaSyCDP_N9fYjlJnshuc4jckOP5IMo0HSrbmo",
//   authDomain: "pafmain-a0be6.firebaseapp.com",
//   projectId: "pafmain-a0be6",
//   storageBucket: "pafmain-a0be6.appspot.com",
//   messagingSenderId: "136832715572",
//   appId: "1:136832715572:web:ac62d5fc2f9bb35cfff361"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);