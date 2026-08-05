import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "warm-tune-mfbwx",
  appId: "1:386265328690:web:6ffcb87a507525370ba02b",
  apiKey: "AIzaSyCcEXbW5sP_xNPXegKGbQVxABm7Ehk4ha0",
  authDomain: "warm-tune-mfbwx.firebaseapp.com",
  storageBucket: "warm-tune-mfbwx.firebasestorage.app",
  messagingSenderId: "386265328690",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-a5d100e7-141e-47cf-aa09-8b431f08c85b");
export const auth = getAuth(app);
export const storage = getStorage(app);
