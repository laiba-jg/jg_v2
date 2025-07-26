import express from 'express';
import dotenv from 'dotenv';
import setupServer from './setup.js';
import logger from './util/logger.js';

dotenv.config();

const app = express();
setupServer(app);

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});


process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
