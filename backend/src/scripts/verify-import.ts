import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model';

dotenv.config();

const verifyImport = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fithub';
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected\n');

        // Get total count
        const totalProducts = await Product.countDocuments();
        console.log(`📊 Total Products: ${totalProducts}\n`);

        // Get statistics by category
        const categoryStats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        console.log('📦 Products by Category:');
        categoryStats.forEach(stat => {
            console.log(`   ${stat._id}:`);
            console.log(`      Count: ${stat.count} products`);
            console.log(`      Price: ${stat.minPrice.toFixed(2)} - ${stat.maxPrice.toFixed(2)} MAD (avg: ${stat.avgPrice.toFixed(2)})`);
        });

        // Get featured products
        const featuredProducts = await Product.find({ featured: true }).select('name price category');
        console.log(`\n⭐ Featured Products (${featuredProducts.length}):`);
        featuredProducts.forEach(p => {
            console.log(`   - ${p.name} (${p.price} MAD) - ${p.category}`);
        });

        // Get sample products
        console.log('\n🔍 Sample Products:');
        const samples = await Product.find().limit(5).select('sku name brand price rating category');
        samples.forEach(p => {
            console.log(`   - ${p.name}`);
            console.log(`     SKU: ${p.sku} | Brand: ${p.brand} | Price: ${p.price} MAD | Rating: ${p.rating}/5`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Verification complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

verifyImport();
