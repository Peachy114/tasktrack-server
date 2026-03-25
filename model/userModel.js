import BaseModel from './baseModel.js';

//reminder
//routes - controller - service - model - firestore
class UserModel extends BaseModel {
    constructor() {
        super('users');
    }

    async createUser(uid, email) {
        await this.collection.doc(uid).set({
            uid, email, role: 'employee'
        });
    }

    async findAll() {
        const snap = await this.collection.get();
        return snap.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
    }
}

export default new UserModel();