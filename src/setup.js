import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import logger from './util/logger.js';
import healthRoutes from './routes/healthRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import mongoose from 'mongoose';

const setup = (app) => {
    app.use(helmet());
    app.use(express.json({ limit: '10kb' }));
    app.use(morgan('combined'));
    app.use(compression());

    mongoose.connect(process.env.MONGO_URI);
    logger.info('Connected to MongoDB');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });

    // routes
    app.use('/api/v1', healthRoutes);
    app.use('/api/v1/profiles', customerRoutes);

    // 404 handler
    app.use((req, res, next) => {
        res.status(404).json({ message: 'Not found' });
    });

    // Global error handler
    app.use((err, req, res, next) => {
        logger.error(err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    });
};

export default setup;