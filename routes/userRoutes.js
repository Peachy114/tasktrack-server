import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import userController from '../controller/userController.js';

const router = express.Router();

//EMPLOYEEEE==================
router.post('/register', authMiddleware, async( req, res) => { userController.registerUser(req, res) }); //POST for /users/register
router.get('/me', authMiddleware, async(req,res) => { userController.getMe(req, res)}); ////GET /users/me

//ADMINN======================
router.get('/', adminMiddleware, async (req, res, next) => userController.getAllUsers(req, res)); //Phase 2 - Admin Creation. ///GET /users - all users (admin only)

export default router;