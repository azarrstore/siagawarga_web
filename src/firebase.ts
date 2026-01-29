import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function mustGetEnv(key: string): string {
  const v = import.meta.env[key] as string | undefined;
  if (!v) throw new Error(`Missing env var ${key}. Create .env from .env.example`);
  return v;
}

const firebaseConfig = {
  apiKey: mustGetEnv("VITE_FIREBASE_API_KEY"),
  authDomain: mustGetEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: mustGetEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: mustGetEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: mustGetEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: mustGetEnv("VITE_FIREBASE_APP_ID")
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
