import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to database');
    } catch (error) {
        console.error(error);
    }
};

//close connection
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('Connection to database closed');
    } catch (error) {
        console.error(error);
    }
};

export { connectDB, closeDB };
