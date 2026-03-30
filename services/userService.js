import userModel from "../model/userModel.js";

class UserService {
    async getUserById(uid) {
        return userModel.findById(uid);
    }

    async createUser(uid, email) {
        const exists = await userModel.exists(uid);
        if (exists) return { message: 'User already exists' };
        await userModel.createUser(uid, email);
        return { message: 'User registered successfully' };
    }

    async getAllUsers() {
        return userModel.findAll();
    }
}

export default new UserService();