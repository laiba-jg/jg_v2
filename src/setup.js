import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import swaggerUi from "swagger-ui-express";

import { connectToRedis } from './util/redis.js';
import logger from './util/logger.js';
import healthRoutes from './routes/healthRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import authenticate from './auth/authenticate.js';
import YAML from "yamljs";
import path from 'path';
import { fileURLToPath } from "url";
import cors from 'cors';
import { isLocal } from './util/env.js';


// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setup = (app) => {
    const swaggerSpecs = YAML.load(path.join(__dirname, '..', "docs/v1/openapi.yml"));

    app.use(helmet());
    app.use(express.json({ limit: '10kb' }));
    app.use(morgan('combined'));
    app.use(compression());
    if (isLocal()) app.use(cors());
    else {
        const allowedDomains = ["https://admin.dev.justgold.me", "https://admin.justgold.me"];
        app.use(
            cors({
                origin: (origin, callback) => {
                    if (!origin || allowedDomains.includes(origin)) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                },
            })
        );
    }
    app.use("/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


    mongoose.connect(process.env.MONGO_URI);
    connectToRedis();
    logger.info('Connected to MongoDB');


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });

    // routes
    app.use('/v1', healthRoutes);

    app.use('/v1/customers', customerRoutes);
    app.use('/v1/transactions', authenticate, transactionRoutes);


    app.use('/v1/users', userRoutes);
    app.use('/v1/admin', adminRoutes);
    app.use('/v1/inventory', inventoryRoutes);
    app.use('/v1/webhooks', webhookRoutes);
    // 404 handler
    app.use((req, res, next) => {
        res.status(404).json({ message: 'Not found', data: { path: req.path, method: req.method, origin: req.origin } });
    });

    // Global error handler
    app.use((err, req, res, next) => {
        logger.error(err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    });
};

export default setup;