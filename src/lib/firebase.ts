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

if (!isFirebaseConfigValid) {
  console.error("DEBUG FIREBASE CONFIG - API Key:", firebaseConfig.apiKey ? "Present" : "Missing");
  console.error("DEBUG FIREBASE CONFIG - Project ID:", firebaseConfig.projectId ? "Present" : "Missing");
  console.error("DEBUG FIREBASE CONFIG - All ENV keys available in import.meta.env:", Object.keys(import.meta.env));
}

if (!isFirebaseConfigValid && import.meta.env.PROD) {
  console.error("Firebase Configuration is missing! Ensure VITE_FIREBASE_... variables are set in your environment.");
}

const app = isFirebaseConfigValid ? initializeApp(firebaseConfig) : null;

// Use a Proxy to throw a highly explicit error if ANY Firebase service is requested without valid env vars
const uninitializedAuthError = () => {
  throw new Error(
    "FRONTEND FIREBASE CONFIG MISSING! " +
    "You must add VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID to your environment variables (like the Vercel Dashboard)."
  );
};

export const auth = app ? getAuth(app) : new Proxy({}, { get: uninitializedAuthError }) as any;
export const googleProvider = new GoogleAuthProvider();
