import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyA28eT0hhMPOiIBRosmYfYWtMLPSUeOJLc",
  authDomain: "inwayfind.firebaseapp.com",
  projectId: "inwayfind",
  storageBucket: "inwayfind.firebasestorage.app", // You already have this configured
  messagingSenderId: "224499484909",
  appId: "1:224499484909:web:b5d63bf1f5139b441ba4e4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Add this export
