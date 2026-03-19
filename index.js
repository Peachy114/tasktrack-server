import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { readFileSync} from 'fs';

const app = express();

//FIREBASE SDK
const serviceAccount = JSON.parse(
    readFileSync('./serviceAccountKey.json', 'utf8')
);
admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});
export const db = admin.firestore();

//express
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
});

