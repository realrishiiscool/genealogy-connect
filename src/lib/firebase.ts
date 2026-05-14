import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDataConnect } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/generated";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAJef-IF27kxjhFYu0yMLFDgGVUwTr2JCo",
  authDomain: "boutify-461fc.firebaseapp.com",
  projectId: "boutify-461fc",
  storageBucket: "boutify-461fc.firebasestorage.app",
  messagingSenderId: "985766329905",
  appId: "1:985766329905:web:72b3140287da1d5a5e9f10",
  measurementId: "G-8EWN04G3Z2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const dataconnect = getDataConnect(app, connectorConfig);
export const analytics = getAnalytics(app);

export default app;
