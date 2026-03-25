import { Router } from 'express';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderStatus);

export default router;
