import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD2S3NOEfIIbHlqabG2osieE-jCWw2CKts",
  authDomain: "gen-lang-client-0860021576.firebaseapp.com",
  databaseURL: "https://gen-lang-client-0860021576-default-rtdb.firebaseio.com",
  projectId: "gen-lang-client-0860021576",
  storageBucket: "gen-lang-client-0860021576.appspot.com",
  messagingSenderId: "82434293809",
  appId: "1:82434293809:web:7febd1e723fa262979d510",
  measurementId: "G-K513LVE87D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
