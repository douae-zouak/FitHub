import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password?: string;
    googleId?: string;
    profile: {
        name: string;
        avatar?: string;
        phone?: string;
    };
    role: 'user' | 'admin';
    subscription?: {
        plan: 'basic' | 'pro' | 'elite' | null;
        status: 'active' | 'cancelled' | 'expired';
        startDate?: Date;
        endDate?: Date;
    };
    preferences: {
        categories: string[];
        brands: string[];
    };
    cart: {
        product: mongoose.Schema.Types.ObjectId;
        quantity: number;
    }[];
    wishlist: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            select: false // Don't include password in queries by default
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        profile: {
            name: {
                type: String,
                required: true
            },
            avatar: String,
            phone: String
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        subscription: {
            plan: {
                type: String,
                enum: ['basic', 'pro', 'elite', null],
                default: null
            },
            status: {
                type: String,
                enum: ['active', 'cancelled', 'expired'],
                default: 'expired'
            },
            startDate: Date,
            endDate: Date
        },
        preferences: {
            categories: [String],
            brands: [String]
        },
        cart: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                }
            }
        ],
        wishlist: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            }
        ]
    },
    {
        timestamps: true
    }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
