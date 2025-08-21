import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "***",
  authDomain: "favmovie-e3ca0.firebaseapp.com",
  projectId: "favmovie-e3ca0",
  storageBucket: "favmovie-e3ca0.firebasestorage.app",
  messagingSenderId: "***",
  appId: "***",
  measurementId: "***"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logOut = () => signOut(auth);