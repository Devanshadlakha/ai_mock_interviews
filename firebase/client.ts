// Import the functions you need from the SDKs you need
// app/firebase/client.ts (or src/firebase/client.ts)

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAtq7IX956SnUUovmNF8b_KA5RcXaYgxoQ",
    authDomain: "prepwise-278fa.firebaseapp.com",
    projectId: "prepwise-278fa",
    storageBucket: "prepwise-278fa.appspot.com", // ❗️FIXED: ".app" to ".appspot.com"
    messagingSenderId: "268108098610",
    appId: "1:268108098610:web:cd78e83f4c895a08dce02b",
    measurementId: "G-0L09Z78RFZ",
};

// Initialize app safely
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export configured services
export const db = getFirestore(app); // ❗️Pass app here
export const auth = getAuth(app);    // ✅ Already correct
export { app };
;