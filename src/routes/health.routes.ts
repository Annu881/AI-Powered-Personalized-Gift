import { Router } from 'express';
import * as healthController from '../controllers/health.controller';

const router = Router();

router.get('/health', healthController.getHealth);
router.get('/ping', healthController.ping);

export default router;
