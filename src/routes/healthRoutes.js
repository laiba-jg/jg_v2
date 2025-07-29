import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json('Api running');
});


router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default router;