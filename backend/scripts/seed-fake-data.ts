import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import User from '../src/models/User.model';
import Product from '../src/models/Product.model';
import Order from '../src/models/Order.model';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Fake user data
const fakeUsers = [
    {
        email: 'ahmed.benali@example.ma',
        password: 'Password123!',
        profile: {
            name: 'Ahmed Benali',
            phone: '+212 6 12 34 56 78'
        },
        role: 'user' as const
    },
    {
        email: 'fatima.zahra@example.ma',
        password: 'Password123!',
        profile: {
            name: 'Fatima Zahra',
            phone: '+212 6 23 45 67 89'
        },
        role: 'user' as const
    },
    {
        email: 'youssef.alami@example.ma',
        password: 'Password123!',
        profile: {
            name: 'Youssef Alami',
            phone: '+212 6 34 56 78 90'
        },
        role: 'user' as const
    },
    {
        email: 'sara.idrissi@example.ma',
        password: 'Password123!',
        profile: {
            name: 'Sara Idrissi',
            phone: '+212 6 45 67 89 01'
        },
        role: 'user' as const
    },
    {
        email: 'karim.tazi@example.ma',
        password: 'Password123!',
        profile: {
            name: 'Karim Tazi',
            phone: '+212 6 56 78 90 12'
        },
        role: 'user' as const
    },
    {
        email: 'nadia.benjelloun@example.ma',
        password: 'Password123!',
        profile: {
            name: 'Nadia Benjelloun',
            phone: '+212 6 67 89 01 23'
        },
        role: 'user' as const
    },
    {
        email: 'omar.fassi@example.ma',
        password: 'Password123!',
        profile: {
            name: 'Omar Fassi',
            phone: '+212 6 78 90 12 34'
        },
        role: 'user' as const
    },
    {
        email: 'leila.amrani@example.ma',
        password: 'Password123!',
        profile: {
            name: 'Leila Amrani',
            phone: '+212 6 89 01 23 45'
        },
        role: 'user' as const
    },
    {
        email: 'mehdi.chakir@example.ma',
        password: 'Password123!',
        profile: {
            name: 'Mehdi Chakir',
            phone: '+212 6 90 12 34 56'
        },
        role: 'user' as const
    },
    {
        email: 'amina.berrada@example.ma',
        password: 'Password123!',
        profile: {
            name: 'Amina Berrada',
            phone: '+212 6 01 23 45 67'
        },
        role: 'user' as const
    }
];

// Fake addresses in Morocco
const fakeAddresses = [
    {
        street: '12 Rue Mohammed V',
        city: 'Casablanca',
        state: 'Grand Casablanca',
        zipCode: '20000',
        country: 'Morocco'
    },
    {
        street: '45 Avenue Hassan II',
        city: 'Rabat',
        state: 'Rabat-Salé-Kénitra',
        zipCode: '10000',
        country: 'Morocco'
    },
    {
        street: '78 Boulevard Zerktouni',
        city: 'Marrakech',
        state: 'Marrakech-Safi',
        zipCode: '40000',
        country: 'Morocco'
    },
    {
        street: '23 Rue de Fès',
        city: 'Fès',
        state: 'Fès-Meknès',
        zipCode: '30000',
        country: 'Morocco'
    },
    {
        street: '56 Avenue des FAR',
        city: 'Tanger',
        state: 'Tanger-Tétouan-Al Hoceïma',
        zipCode: '90000',
        country: 'Morocco'
    },
    {
        street: '89 Rue Allal Ben Abdellah',
        city: 'Agadir',
        state: 'Souss-Massa',
        zipCode: '80000',
        country: 'Morocco'
    },
    {
        street: '34 Boulevard Mohammed VI',
        city: 'Oujda',
        state: 'Oriental',
        zipCode: '60000',
        country: 'Morocco'
    },
    {
        street: '67 Avenue Moulay Youssef',
        city: 'Meknès',
        state: 'Fès-Meknès',
        zipCode: '50000',
        country: 'Morocco'
    }
];

// Order statuses and payment methods
const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
const paymentStatuses = ['pending', 'completed', 'failed'] as const;
const paymentMethods = ['Credit Card', 'Cash on Delivery', 'PayPal', 'Bank Transfer'];

// Helper function to get random element from array
function getRandomElement<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random number between min and max
function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get random date within last 6 months
function getRandomDate(): Date {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
    return new Date(randomTime);
}

async function seedFakeData() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fithub';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing fake data (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing fake data...');
        await User.deleteMany({ email: { $in: fakeUsers.map(u => u.email) } });
        
        // Create users
        console.log('👥 Creating fake users...');
        const createdUsers = await User.insertMany(fakeUsers);
        console.log(`✅ Created ${createdUsers.length} fake users`);

        // Get all products from database
        console.log('📦 Fetching products from database...');
        const products = await Product.find({}).limit(100);
        
        if (products.length === 0) {
            console.log('⚠️  No products found in database. Please import products first.');
            return;
        }
        
        console.log(`✅ Found ${products.length} products`);

        // Create orders for each user
        console.log('🛒 Creating fake orders...');
        const orders = [];
        
        for (const user of createdUsers) {
            // Each user will have 1-5 orders
            const numberOfOrders = getRandomNumber(1, 5);
            
            for (let i = 0; i < numberOfOrders; i++) {
                // Each order will have 1-4 items
                const numberOfItems = getRandomNumber(1, 4);
                const orderItems = [];
                let totalAmount = 0;

                for (let j = 0; j < numberOfItems; j++) {
                    const product = getRandomElement(products);
                    const quantity = getRandomNumber(1, 3);
                    
                    // Parse price from string (e.g., "149,00 MAD" -> 149)
                    const priceMatch = product.price.toString().match(/[\d,]+/);
                    const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : 0;
                    
                    orderItems.push({
                        product: product._id,
                        name: product.name,
                        quantity,
                        price
                    });
                    
                    totalAmount += price * quantity;
                }

                const orderStatus = getRandomElement(orderStatuses);
                const paymentStatus = orderStatus === 'delivered' 
                    ? 'completed' 
                    : orderStatus === 'cancelled' 
                        ? getRandomElement(['failed', 'completed'] as const)
                        : getRandomElement(paymentStatuses);

                orders.push({
                    user: user._id,
                    items: orderItems,
                    totalAmount,
                    status: orderStatus,
                    shippingAddress: getRandomElement(fakeAddresses),
                    paymentMethod: getRandomElement(paymentMethods),
                    paymentStatus,
                    createdAt: getRandomDate(),
                    updatedAt: getRandomDate()
                });
            }
        }

        const createdOrders = await Order.insertMany(orders);
        console.log(`✅ Created ${createdOrders.length} fake orders`);

        // Display summary
        console.log('\n📊 Summary:');
        console.log(`   - Users created: ${createdUsers.length}`);
        console.log(`   - Orders created: ${createdOrders.length}`);
        console.log(`   - Total revenue: ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)} MAD`);
        
        console.log('\n👤 Sample user credentials:');
        console.log('   Email: ahmed.benali@example.ma');
        console.log('   Password: Password123!');
        
        console.log('\n✨ Fake data seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding fake data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

// Run the seeding function
seedFakeData();
