import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import FirebaseConfig from './firebase-config';

const app = initializeApp(FirebaseConfig);
const auth = getAuth(app);
const dataBase = getFirestore(app);

export { dataBase, app, auth };
