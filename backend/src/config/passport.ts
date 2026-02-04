import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import User from '../models/User.model';

// Load environment variables
dotenv.config();

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                // Extract user info from Google profile
                const email = profile.emails?.[0]?.value;
                const name = profile.displayName;
                const avatar = profile.photos?.[0]?.value;

                if (!email) {
                    return done(new Error('No email found in Google profile'), undefined);
                }

                // Check if user already exists
                let user = await User.findOne({ email });

                if (user) {
                    // User exists, return the user
                    return done(null, user);
                } else {
                    // Create new user
                    user = await User.create({
                        email,
                        profile: {
                            name: name || email.split('@')[0],
                            avatar
                        },
                        // No password needed for OAuth users
                        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
                        role: 'user'
                    });

                    return done(null, user);
                }
            } catch (error) {
                return done(error as Error, undefined);
            }
        }
    )
);

// Serialize user for the session
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
