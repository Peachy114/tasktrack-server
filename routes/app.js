import taskRoutes from './taskRoutes.js';
import userRoutes from './userRoutes.js';

export const registerRoutes = (app) => {
    app.use('/tasks', taskRoutes);
    app.use('/users', userRoutes);
};


