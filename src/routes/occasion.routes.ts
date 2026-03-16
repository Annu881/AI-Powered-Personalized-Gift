import { Router } from 'express';
import * as occasionController from '../controllers/occasion.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // Protect all occasion routes

router.get('/', occasionController.getOccasions);
router.post('/', occasionController.createOccasion);
router.delete('/:id', occasionController.deleteOccasion);

export default router;
