import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJsB2LhNwU1oaYmzxXqXw0NigM93OlkzQ",
  authDomain: "secroad-5dfc9.firebaseapp.com",
  projectId: "secroad-5dfc9",
  storageBucket: "secroad-5dfc9.firebasestorage.app",
  messagingSenderId: "415579055345",
  appId: "1:415579055345:web:56a5a53a490e62d0477550",
  measurementId: "G-0JMKFF0DE2"
};

// --- SECROAD_FIREBASE_BRIDGE ---
// Initialize Firebase only if no apps are detected to avoid dual-init crashes.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// [PERSISTENCE]: Bridge JS SDK with Native AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("--- [FIREBASE_SYSTEM]: Persistent Shield Initialized ---");
