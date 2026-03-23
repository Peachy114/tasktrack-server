import admin from 'firebase-admin';
import { readFileSync} from 'fs';
import dotenv from 'dotenv';

dotenv.config();

//FIREBASE SDK
const serviceAccount = JSON.parse(
    readFileSync('./serviceAccountKey.json', 'utf8')
);
admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();
export default admin;