import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDataConnect } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/generated";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate that all required config values are present
const missingVars = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn(`Missing Firebase environment variables: ${missingVars.join(", ")}. Please check your .env file.`);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const dataconnect = getDataConnect(app, connectorConfig);

export default app;
