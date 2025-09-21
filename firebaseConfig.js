// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIgKKvT9ctI2yunJZ1T4dGCfm7iZc7otA",
  authDomain: "notekit-app.firebaseapp.com",
  projectId: "notekit-app",
  storageBucket: "notekit-app.appspot.com", // fixed
  messagingSenderId: "371766438256",
  appId: "1:371766438256:web:be7fc070622127879847b5"
};

// Initialize Firebasehjhhhghgh
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
