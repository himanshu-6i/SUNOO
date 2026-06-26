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
  apiKey: "AIzaSyD2S3NOEfIIbHlqabG2osieE-jCWw2CKts",
  authDomain: "gen-lang-client-0860021576.firebaseapp.com",
  projectId: "gen-lang-client-0860021576",
  storageBucket: "gen-lang-client-0860021576.appspot.com",
  messagingSenderId: "82434293809",
  appId: "1:82434293809:web:7febd1e723fa262979d510",
  databaseURL: "https://gen-lang-client-0860021576-default-rtdb.firebaseio.com",
  measurementId: "G-K513LVE87D"
};

const app = initializeApp(config);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
