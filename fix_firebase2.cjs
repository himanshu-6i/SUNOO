const fs = require('fs');

const firebaseCode = `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const configFiles = import.meta.glob('../firebase-applet-config.json', { eager: true });
const firebaseConfig = configFiles['../firebase-applet-config.json'] ? (configFiles['../firebase-applet-config.json'] as any).default : {};

// Ensure storage bucket uses .appspot.com if needed
if (firebaseConfig.storageBucket && firebaseConfig.storageBucket.includes('.firebasestorage.app')) {
  firebaseConfig.storageBucket = firebaseConfig.storageBucket.replace('.firebasestorage.app', '.appspot.com');
}

console.log('firebaseConfig extracted:', firebaseConfig);

const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if it exists in the config
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId) 
  : getFirestore(app);
  
export const auth = getAuth(app);
export const storage = getStorage(app);
`;

fs.writeFileSync('src/firebase.ts', firebaseCode);
