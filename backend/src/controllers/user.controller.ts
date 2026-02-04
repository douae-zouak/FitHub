import { Request, Response } from 'express';
import User from '../models/User.model';
import Product from '../models/Product.model';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, count: 1, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// --- Cart Operations ---

// Get Cart
export const getCart = async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user.id).populate('cart.product');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, count: user.cart.length, data: user.cart });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Add to Cart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productId, quantity } = req.body;
        const userId = (req as any).user.id;

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        // Check if item already in cart
        const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Update quantity
            user.cart[itemIndex].quantity += quantity || 1;
        } else {
            // Add new item
            user.cart.push({ product: productId as any, quantity: quantity || 1 });
        }

        await user.save();

        // Return populated cart
        user = await User.findById(userId).populate('cart.product');

        res.json({ success: true, message: 'Added to cart', data: user?.cart });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Remove from Cart
export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = (req as any).user.id;

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.cart = user.cart.filter(item => item.product.toString() !== productId);

        await user.save();

        // Return populated cart
        user = await User.findById(userId).populate('cart.product');

        res.json({ success: true, message: 'Removed from cart', data: user?.cart });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// --- Wishlist Operations ---

// Get Wishlist
export const getWishlist = async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user.id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, count: user.wishlist.length, data: user.wishlist });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Toggle Wishlist
export const toggleWishlist = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;
        const userId = (req as any).user.id;

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        const index = user.wishlist.indexOf(productId as any);

        if (index > -1) {
            // Remove
            user.wishlist.splice(index, 1);
            await user.save();
            res.json({ success: true, message: 'Removed from wishlist', data: user.wishlist, action: 'removed' });
        } else {
            // Add
            user.wishlist.push(productId as any);
            await user.save();
            res.json({ success: true, message: 'Added to wishlist', data: user.wishlist, action: 'added' });
        }

    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
