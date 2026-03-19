import express from 'express';
import { db } from '../index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

//POST for /users/register
router.post('/register', authMiddleware, async( req, res) => {
    try {
        const { uid, email } = req.user;
        const userRef = db.collection('users').doc(uid);
        const userSnap = await userRef.get();

        if (userSnap.exists) return res.status(200).json({ message: 'User already exists'});
        await userRef.set({
            uid, email, role: 'employee' //already changed in firestore employee to admin
        });
        res.status(201).json({ message: 'User registered success'});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//GET /users/me
router.get('/me', authMiddleware, async(req,res) => {
    try {
        const { uid } = req.user;
        const userSnap = await db.collection('users').doc(uid).get();
        if (!userSnap.exists) {
            return res.status(404).json({ error: 'User not found'});
        }
        res.status(200).json(userSnap.data());

    } catch (err) {
        console.log('Error:', err.message);
        res.status(500).json({ error: err.message});
    }
});


export default router;