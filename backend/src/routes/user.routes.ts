import { Router } from 'express';
import {
    getProfile,
    getCart,
    addToCart,
    removeFromCart,
    getWishlist,
    toggleWishlist
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes
router.use(protect);

router.get('/profile', getProfile);

// Cart Routes
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.delete('/cart/:productId', removeFromCart);

// Wishlist Routes
router.get('/wishlist', getWishlist);
router.post('/wishlist', toggleWishlist);

export default router;
