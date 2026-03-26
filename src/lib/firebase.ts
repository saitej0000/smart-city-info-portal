import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate config to prevent top-level crash in Vercel/Production if env vars are missing
const isFirebaseConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

if (!isFirebaseConfigValid && import.meta.env.PROD) {
  console.error("Firebase Configuration is missing! Ensure VITE_FIREBASE_... variables are set in your environment.");
}

const app = isFirebaseConfigValid ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null as any;
export const googleProvider = new GoogleAuthProvider();

