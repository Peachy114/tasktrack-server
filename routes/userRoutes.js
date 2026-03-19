import express from 'express';
import db from '../index';
import { authMiddleware } from '../middleware/authmiddleware';

const router = express.Router();

//POST for /users/register
router.post('/register', authMiddleware, async( req, res) => {
    try {
        const { uid, email } = req.user;
        const userRef = db.colllection('users', doc(uid));
        const userSnap = await userRef.get();

        if (userSnap.exists) return res.status(200).json({ message: 'User already exists'});
        await userRef.set({
            uid, email, role: 'employee' //I can change that to admin later firestore console.
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
        const userSnap = await db.colllection('users').doc(uid).get();
        if (!userSnap.exists) {
            return res.status(404).json({ error: 'User not found'});
        }
        res.status(200).json(userSnap.data());

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
})