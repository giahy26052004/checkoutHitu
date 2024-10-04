import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAlxrvHcg1umaO7E94_kOOpbygOGQn3Vo",
  authDomain: "checkout-28664.firebaseapp.com",
  projectId: "checkout-28664",
  storageBucket: "checkout-28664.appspot.com",
  messagingSenderId: "886814544025",
  appId: "1:886814544025:web:09e7011f451b94efa0e808",
  measurementId: "G-7KYX59JPPW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
