import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const configFiles = import.meta.glob('../firebase-applet-config.json', { eager: true });
const firebaseConfig = configFiles['../firebase-applet-config.json'] ? (configFiles['../firebase-applet-config.json'] as any).default : {};

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey || "missing-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || "missing",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || "missing",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || "missing",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || "missing",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId || "1:1111:web:111",
};

const app = initializeApp(config);
export const db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || "(default)");
export const auth = getAuth(app);
export const storage = getStorage(app);
