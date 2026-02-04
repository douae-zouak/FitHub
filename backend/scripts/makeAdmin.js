const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const UserSchema = new mongoose.Schema({
    email: String,
    role: String
}, { strict: false });

const User = mongoose.model('User', UserSchema);

const email = process.argv[2];

if (!email) {
    console.log('Please provide an email address: node scripts/makeAdmin.js <email>');
    process.exit(1);
}

const makeAdmin = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error('Error: MONGODB_URI is not defined in .env');
            console.log('Attempting to use path:', path.resolve(__dirname, '../.env'));
            process.exit(1);
        }
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`Successfully promoted ${email} to admin`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
