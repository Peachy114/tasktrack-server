import BaseModel from "./baseModel.js";

//reminder
//routes - controller - service - model - firestore
class TaskModel extends BaseModel {
    constructor() {
        super('tasks'); 
    }

    async createTask(title, description) {
        return await this.create({
            title,
            description,
            status: 'backlog',
            assignedTo: null,
            assignedEmail: null
        });
    }

    async findByUserId(uid) {
        const snap = await this.collection
            .where('assignedTo', '==', uid)
            .get();
        return snap.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
    }

    async assign(taskId, userId, userEmail) {
        await this.update(taskId, {
            assignedTo: userId,
            assignedEmail: userEmail
        });
    }

    async updateStatus(taskId, status) {
        await this.update(taskId, { status });
    }
}

export default new TaskModel();