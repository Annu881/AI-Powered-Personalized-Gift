import { Router } from 'express';
import * as mbtiController from '../controllers/mbti.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Middleware to optionally authenticate
router.post('/quiz', (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) return authenticate(req, res, next);
    next();
}, mbtiController.processQuiz);

export default router;
