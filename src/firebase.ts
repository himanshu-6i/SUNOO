import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const configFiles = import.meta.glob('../firebase-applet-config.json', { eager: true });
const firebaseConfig = configFiles['../firebase-applet-config.json'] ? (configFiles['../firebase-applet-config.json'] as any).default : {};

console.log('firebaseConfig extracted:', firebaseConfig);

if (firebaseConfig.storageBucket && firebaseConfig.storageBucket.includes('.firebasestorage.app')) {
  firebaseConfig.storageBucket = firebaseConfig.storageBucket.replace('.firebasestorage.app', '.appspot.com');
}

const app = initializeApp(firebaseConfig);
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId) 
  : getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
