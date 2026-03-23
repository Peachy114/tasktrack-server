import admin from 'firebase-admin';

//for protected routes (Token verification)
export async function authMiddleware(req, res, next) {
    const  authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided'});
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; //role checking
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid Token'});
    }
}




