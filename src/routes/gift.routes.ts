import { Router } from 'express';
import * as giftController from '../controllers/gift.controller';

const router = Router();

router.get('/recommendations', giftController.getRecommendations);
router.post('/', giftController.createGift);

export default router;
