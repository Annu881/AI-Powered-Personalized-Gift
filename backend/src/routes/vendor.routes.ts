import { Router } from 'express';
import * as vendorController from '../controllers/vendor.controller';

const router = Router();

router.get('/pending', vendorController.getPendingCustomizations);
router.post('/approve/:id', vendorController.approveCustomization);
router.post('/reject/:id', vendorController.rejectCustomization);

export default router;
