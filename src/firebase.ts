import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const configFiles = import.meta.glob('../firebase-applet-config.json', { eager: true });
const firebaseConfig = configFiles['../firebase-applet-config.json'] ? (configFiles['../firebase-applet-config.json'] as any).default : {};

console.log('firebaseConfig extracted:', firebaseConfig);

const providedBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || "gen-lang-client-0860021576.firebasestorage.app";
const bucketToUse = providedBucket.includes('.firebasestorage.app') ? providedBucket.replace('.firebasestorage.app', '.appspot.com') : providedBucket;

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey || "AIzaSyD2S3NOEfIIbHlqabG2osieE-jCWw2CKts",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || "gen-lang-client-0860021576.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || "gen-lang-client-0860021576",
  storageBucket: bucketToUse,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || "82434293809",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId || "1:82434293809:web:7febd1e723fa262979d510",
  databaseURL: "https://gen-lang-client-0860021576-default-rtdb.firebaseio.com",
  measurementId: "G-K513LVE87D"
};

const app = initializeApp(config);
export const db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || "(default)");
export const auth = getAuth(app);
export const storage = getStorage(app);
