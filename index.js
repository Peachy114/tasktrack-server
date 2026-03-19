import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { readFileSync} from 'fs';

import userRoutes from './routes/userRoutes.js'


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
app.use('/users', userRoutes);

app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});

