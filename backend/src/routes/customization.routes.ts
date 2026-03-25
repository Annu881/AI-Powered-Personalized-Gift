import { Router } from 'express';
import * as customizationController from '../controllers/customization.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/styles/:type', customizationController.getPersonalityStyles);
router.post('/', authenticate, customizationController.saveCustomization);

export default router;
