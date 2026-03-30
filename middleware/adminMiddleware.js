import { db } from '../config/firebase.config.js';
import { authMiddleware } from './authMiddleware.js';
import { sendError } from '../utils/response.js';

export async function adminMiddleware(req, res, next) {
    authMiddleware(req, res, async () => {
        try {
            const { uid } = req.user;
            const userSnap = await db.collection('users').doc(uid).get();

            if (!userSnap.exists) {
                return sendError(res, 'User not found', 404);
            }

            const user = userSnap.data();

            if (user.role !== 'admin') {
                return sendError(res, 'Forbidden', 403);
            }

            next();
        } catch (err) {
            sendError(res, err.message);
        }
    });
}