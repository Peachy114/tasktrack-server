import { db } from '../index.js';
import { authMiddleware } from './authMiddleware.js';

export async function adminMiddleware(req, res, next) {
   authMiddleware(req, res, async () => {
        try {
            const { uid } = req.user;
            const userSnap = await db.collection('users').doc(uid).get();

            if (!userSnap.exists) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = userSnap.data();

            if (user.role !== 'admin') {
                return res.status(403).json({ error: 'Forbidden - Admins only' });
            }

            next(); //next kapag nalampasan na lahat.
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}