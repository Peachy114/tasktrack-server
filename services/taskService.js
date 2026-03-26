import taskModel from "../model/taskModel.js";

//reminder
//routes - controller - service - model - firestore
class TaskService {
    async createTask(title, description) {
        const id = await taskModel.createTask(title, description);
        return { id, message: 'Task created!' };
    }

    async getAllTasks() {
        return await taskModel.findAll();
    }

    async assignTask(taskId, userId, userEmail) {
        const task = await taskModel.findById(taskId);
        if (!task) throw new Error('Task not found');
        await taskModel.assign(taskId, userId, userEmail);
        return { message: 'Task assigned successfully!' };
    }

    async getMyTasks(uid) {
        return await taskModel.findByUserId(uid);
    }

    async updateStatus(taskId, uid, status) {
        const task = await taskModel.findById(taskId);
        if (!task) throw new Error('Task not found');
        if (task.assignedTo !== uid) throw new Error('Forbidden');
        await taskModel.updateStatus(taskId, status);
        return { message: 'Status updated!' };
    }  
}

export default new TaskService();