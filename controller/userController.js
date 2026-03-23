import BaseController from './baseController.js';
import userService from '../services/userService.js';

class UserController extends BaseController {
    async registerUser(req, res) {
        try {
            const { uid, email } = req.user;
            if (!uid || !email) {
                return this.sendBadRequest(res, 'Invalid user data');
            }
            const result = await userService.createUser(uid, email);
            this.sendSuccess(res, result, 201);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }

    async getMe(req, res) {
        try {
            const { uid } = req.user;
            const user = await userService.getUserById(uid);
            if (!user) return this.sendNotFound(res, 'User not found');
            this.sendSuccess(res, user);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            this.sendSuccess(res, users);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }
}

export default new UserController();