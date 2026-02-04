import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
    res.status(501).json({ message: 'Create subscription - to be implemented' });
});

router.get('/', (req, res) => {
    res.status(501).json({ message: 'Get subscription - to be implemented' });
});

router.put('/cancel', (req, res) => {
    res.status(501).json({ message: 'Cancel subscription - to be implemented' });
});

export default router;
