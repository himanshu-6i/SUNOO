import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const snapshot = await getDocs(collection(db, 'tracks'));
  console.log("Total tracks:", snapshot.docs.length);
  snapshot.docs.forEach(d => console.log(d.id, d.data().title, d.data().ownerId, d.data().visibility));
  process.exit(0);
}
run();
