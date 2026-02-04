import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    sku: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    images: string[];
    stock: number;
    rating: number;
    reviewCount: number;
    specifications: Record<string, any>;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        sku: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            index: true
        },
        brand: {
            type: String,
            required: true,
            index: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        images: {
            type: [String],
            default: []
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        reviewCount: {
            type: Number,
            default: 0
        },
        specifications: {
            type: Schema.Types.Mixed,
            default: {}
        },
        featured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Indexes for search and filtering
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
