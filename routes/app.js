import taskRoutes from './taskRoutes.js';
import userRoutes from './userRoutes.js';

export const registerRoutes = (app) => {
    
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate')
        res.set('Pragma', 'no-cache')
        next()
    });

    app.use('/tasks', taskRoutes);
    app.use('/users', userRoutes);
};


