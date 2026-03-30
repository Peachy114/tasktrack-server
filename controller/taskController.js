import BaseController from './baseController.js';
import taskService from '../services/taskService.js';

class TaskController extends BaseController {
    async createTask(req, res) {
        try {
            const { title, description } = req.body;
            if (!title || title.trim() === '') {
                return this.sendBadRequest(res, 'Title is required');
            }
            if (!description || description.trim() === '') {
                return this.sendBadRequest(res, 'Description is required');
            }
            const result = await taskService.createTask(
                title.trim(), 
                description.trim()
            );
            this.sendSuccess(res, result, 201);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }


    async getAllTasks(req, res) {
        try {
            const tasks = await taskService.getAllTasks();
            this.sendSuccess(res, tasks);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }


    async assignTask(req, res) {
        try {
            const { taskId } = req.params;
            const { userId, userEmail } = req.body;
            if (!taskId) {
                return this.sendBadRequest(res, 'Task ID is required');
            }
            if (!userId || !userEmail) {
                return this.sendBadRequest(res, 'User ID and email are required');
            }
            const result = await taskService.assignTask(taskId, userId, userEmail);
            this.sendSuccess(res, result);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }


    async getMyTasks(req, res) {
        try {
            const { uid } = req.user;
            const tasks = await taskService.getMyTasks(uid);
            this.sendSuccess(res, tasks);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }

    async updateStatus(req, res) {
        try {
            const { taskId } = req.params;
            const { status } = req.body;
            const { uid, email } = req.user; 

            if (!status) {
                return this.sendBadRequest(res, 'Status is required');
            }

            const validStatus = ['backlog', 'in_progress', 'done'];
            if (!validStatus.includes(status)) {
                return this.sendBadRequest(res, 'Invalid status value');
            }

            const result = await taskService.updateStatus(taskId, uid, status, email); 
            this.sendSuccess(res, result);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }


}

export default new TaskController();