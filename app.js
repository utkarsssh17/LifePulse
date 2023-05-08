import express from 'express';
import dotenv from 'dotenv';
import { addGlobalMiddlewares } from './middleware.js';
import { connectDB } from './config/db.js';
import configRoutes from './routes/index.js';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Global middlewares
addGlobalMiddlewares(app);

// Routes
configRoutes(app);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

