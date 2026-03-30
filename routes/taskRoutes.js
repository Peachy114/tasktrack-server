import express from 'express';
import taskController from '../controller/taskController.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

//ADMIN ROUTES============================
router.post('/', adminMiddleware, async (req, res) => {  taskController.createTask(req, res)}); //POST /tasks
router.get('/', adminMiddleware, async (req, res) => { taskController.getAllTasks (req, res)}); //Phase-2 Admin Task Creation
router.put('/:taskId/assign', adminMiddleware, async ( req, res) => {  taskController.assignTask(req, res)}); //phase-3 PUT /tasks/:taskId/assign
router.get('/stats/monthly', adminMiddleware, async (req, res) => { taskController.getMonthlyStats(req, res) }); //phase-3 GET /tasks/stats/monthly for monthly stats
router.get('/stats/summary', adminMiddleware, async (req, res) => { taskController.getTaskStats(req, res) }); //:taskId routes /tasks/stats/summary

//EMPLOYEE=================================
router.get('/my', authMiddleware, async ( req, res) => { taskController.getMyTasks(req, res)}); // phase-3 GET /tasks/my engpoint for the regular to get all task data
router.put('/:taskId/status', authMiddleware, async (req, res) => { taskController.updateStatus(req, res)}); //phase-3 for updating status

export default router;

