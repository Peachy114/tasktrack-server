import BaseController from './baseController.js';
import taskService from '../services/taskService.js';

class TaskController extends BaseController {
    async createTask(req, res) {
        try {
            const { title, description } = req.body
            const { email } = req.user

            if (!title || title.trim() === '') {
                return this.sendBadRequest(res, 'Title is required')
            }
            if (!description || description.trim() === '') {
                return this.sendBadRequest(res, 'Description is required')
            }
            const result = await taskService.createTask(
                title.trim(), 
                description.trim(),
                email 
            )
            this.sendSuccess(res, result, 201)
        } catch (err) {
            this.sendError(res, err.message)
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

    async getMonthlyStats(req, res) {
        try {
            const tasks = await taskService.getAllTasks()
            const now = new Date()
            const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            const monthCount = 6

            const labels = []
            const pending = [], inProgress = [], completed = []

            for (let i = monthCount - 1; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
                labels.push(MONTHS[d.getMonth()])

                const updatedThisMonth = tasks.filter(t => {
                    const date = t.updatedAt ? new Date(t.updatedAt) : null
                    return date && date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear()
                })

                const createdThisMonth = tasks.filter(t => {
                    const date = t.createdAt ? new Date(t.createdAt) : null
                    return date && date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear()
                })

                pending.push(createdThisMonth.filter(t => t.status === 'backlog').length)
                inProgress.push(updatedThisMonth.filter(t => t.status === 'in_progress').length)
                completed.push(updatedThisMonth.filter(t => t.status === 'done').length)
            }

            this.sendSuccess(res, { labels, pending, inProgress, completed })
        } catch (err) {
            this.sendError(res, err.message)
        }
    }

    async getTaskStats(req, res) {
        try {
            const tasks = await taskService.getAllTasks()
            
            const total          = tasks.length
            const doneTasks      = tasks.filter(t => t.status === 'done').length
            const activeTasks    = tasks.filter(t => t.status === 'in_progress').length
            const pendingTasks   = tasks.filter(t => t.status === 'backlog').length
            const completionRate = total > 0 ? Math.round((doneTasks / total) * 100) : 0

            this.sendSuccess(res, {
                total,
                inProgress: activeTasks,
                completed:  doneTasks,
                pending:    pendingTasks,
                completionRate,
            })
        } catch (err) {
            this.sendError(res, err.message)
        }
    }


}

export default new TaskController();