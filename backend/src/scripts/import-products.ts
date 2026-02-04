import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import Product from '../models/Product.model';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fithub';
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Clean price string
const cleanPrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
};

// Parse CSV and import products
const importProducts = async () => {
    const csvPath = path.join(__dirname, '../../..', 'Decathlon_data2.csv');

    if (!fs.existsSync(csvPath)) {
        console.error(`❌ CSV file not fo   und at: ${csvPath}`);
        process.exit(1);
    }

    console.log(`📂 Reading CSV from: ${csvPath}`);

    // Read and parse CSV
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    console.log(`📊 Parsed ${records.length} products from CSV`);

    // Transform data
    const products = records.map((row: any) => {
        const price = cleanPrice(row.prix);
        const rating = parseFloat(row.note) || 0;

        return {
            sku: row.sku || `sku-${Date.now()}-${Math.random()}`,
            name: row.nom || 'Produit sans nom',
            description: row.nom || 'Description à venir',
            category: row.category || 'non-categorise',
            brand: row.marque || 'Sans marque',
            price: price,
            images: row.image ? [row.image] : [],
            stock: Math.floor(Math.random() * 100) + 10,
            rating: Math.min(5, Math.max(0, rating)), // Ensure rating is between 0-5
            reviewCount: rating > 0 ? Math.floor(Math.random() * 50) + 1 : 0,
            specifications: {
                link: row.lien || ''
            },
            featured: false
        };
    });

    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});

    // Insert products in batches
    console.log('💾 Inserting products into database...');
    const batchSize = 50;
    let inserted = 0;

    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        try {
            await Product.insertMany(batch, { ordered: false });
            inserted += batch.length;
            console.log(`   ✓ Inserted ${inserted}/${products.length} products`);
        } catch (error: any) {
            console.log(`   ⚠️  Batch ${i}-${i + batchSize}: ${error.writeErrors?.length || 0} errors`);
            inserted += batch.length - (error.writeErrors?.length || 0);
        }
    }

    console.log(`✅ Import completed! Total inserted: ${inserted}`);

    // Display statistics
    const totalProducts = await Product.countDocuments();
    const stats = await Product.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                avgPrice: { $avg: '$price' }
            }
        },
        { $sort: { count: -1 } }
    ]);

    console.log('\n📈 Import Statistics:');
    console.log(`   Total products in DB: ${totalProducts}`);
    console.log(`   Categories: ${stats.length}`);
    console.log('\n📦 Top categories:');
    stats.slice(0, 10).forEach(stat => {
        console.log(`   - ${stat._id}: ${stat.count} products (avg: ${stat.avgPrice.toFixed(2)} MAD)`);
    });

    // Mark some random products as featured
    const featuredCount = Math.min(8, totalProducts);
    const randomProducts = await Product.aggregate([{ $sample: { size: featuredCount } }]);
    const featuredIds = randomProducts.map(p => p._id);

    await Product.updateMany(
        { _id: { $in: featuredIds } },
        { $set: { featured: true } }
    );

    console.log(`\n⭐ Marked ${featuredCount} products as featured`);
};

// Main execution
const run = async () => {
    try {
        await connectDB();
        await importProducts();
        console.log('\n🎉 Data import completed successfully!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
};

run();
