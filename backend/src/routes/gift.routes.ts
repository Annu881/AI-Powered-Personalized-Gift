import { Router } from 'express';
import * as giftController from '../controllers/gift.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/recommendations', giftController.getRecommendations);
router.post('/', giftController.createGift);

// Favorites (Protected)
router.get('/favorites', authenticate, giftController.getFavorites);
router.post('/favorites', authenticate, giftController.toggleFavorite);

export default router;
