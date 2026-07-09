import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './configs/cors.js';
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './configs/db.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);
app.use(corsMiddleware);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

connectDB().catch((error) => {
    console.error('Database connection failed:', error);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});