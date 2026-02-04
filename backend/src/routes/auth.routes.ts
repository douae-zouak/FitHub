import { Router } from 'express';
import { register, login, googleAuth, googleCallback } from '../controllers/auth.controller';
import passport from '../config/passport';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/signin' }), googleCallback);

export default router;
