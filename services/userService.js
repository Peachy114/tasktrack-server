import userModel from "../model/userModel.js";

//reminder
//routes - controller - service - model - firestore
class UserService {
    async getUserById(uid) {
        const user = await userModel.findById(uid);
        if (!user) throw new Error('User not found');
        return user;
    }

    async createUser(uid, email) {
        const exists = await userModel.exists(uid);
        if (exists) return { message: 'User already exists' };
        await userModel.createUser(uid, email);
        return { message: 'User registered successfully' };
    }

    async getAllUsers() {
        return await userModel.findAll();
    }
}

export default new UserService();
