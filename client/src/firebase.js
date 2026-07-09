// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbV2_LjVkzTGFOeWyfFGKOacGzaNaGIN4",
  authDomain: "renalease-56154.firebaseapp.com",
  projectId: "renalease-56154",
  storageBucket: "renalease-56154.firebasestorage.app",
  messagingSenderId: "951299738924",
  appId: "1:951299738924:web:16337d58dd644b27627089",
  measurementId: "G-XRGF9TJF78",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
