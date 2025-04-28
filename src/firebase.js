import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyA28eT0hhMPOiIBRosmYfYWtMLPSUeOJLc",
  authDomain: "inwayfind.firebaseapp.com",
  projectId: "inwayfind",
  storageBucket: "inwayfind.firebasestorage.app",
  messagingSenderId: "224499484909",
  appId: "1:224499484909:web:b5d63bf1f5139b441ba4e4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore Database
