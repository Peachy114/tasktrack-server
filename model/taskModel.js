import BaseModel from "./baseModel.js";
import { FieldValue } from "firebase-admin/firestore";

class TaskModel extends BaseModel {
    constructor() {
        super('tasks'); 
    }

    async createTask(title, description, userEmail = null) {
        const task = await this.create({
            title,
            description,
            status: 'backlog',
            assignedTo: null,
            assignedEmail: null,
            createdAt: FieldValue.serverTimestamp(), 
            updatedAt: null,
        });

        await this.db.collection('activities').add({ 
            type: 'task_created',
            taskId: task.id,      
            taskTitle: title,
            userEmail: userEmail,
            createdAt: FieldValue.serverTimestamp(),
        });

        return task;
    }

    async findByUserId(uid) {
        const snap = await this.collection
            .where('assignedTo', '==', uid)
            .get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async assign(taskId, userId, userEmail) {
        await this.update(taskId, {
            assignedTo: userId,
            assignedEmail: userEmail,
        });
    }

    async updateStatus(taskId, status, taskTitle, userEmail) {
        await this.update(taskId, {
            status,
            updatedAt: FieldValue.serverTimestamp(),
        });

        await this.db.collection('activities').add({ 
            type: 'status_changed',
            taskId,
            taskTitle,
            nextStatus: status,
            userEmail,
            createdAt: FieldValue.serverTimestamp(),
        });
    }
}

export default new TaskModel();