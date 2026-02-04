import { Router } from 'express';
import { getMyOrders, createOrder } from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes
router.use(protect);

router.route('/')
    .post(createOrder);

router.get('/myorders', getMyOrders);

router.get('/:id', (req, res) => {
    res.status(501).json({ message: 'Get order by ID - to be implemented' });
});

export default router;

