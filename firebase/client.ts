// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import{getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAtq7IX956SnUUovmNF8b_KA5RcXaYgxoQ",
    authDomain: "prepwise-278fa.firebaseapp.com",
    projectId: "prepwise-278fa",
    storageBucket: "prepwise-278fa.firebasestorage.app",
    messagingSenderId: "268108098610",
    appId: "1:268108098610:web:cd78e83f4c895a08dce02b",
    measurementId: "G-0L09Z78RFZ"
};

// Initialize Firebase
const app =!getApps.length? initializeApp(firebaseConfig) :getApp();
export const db = getFirestore();
export const auth = getAuth(app);