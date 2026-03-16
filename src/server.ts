import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import giftRoutes from './routes/gift.routes';
import occasionRoutes from './routes/occasion.routes';
import mbtiRoutes from './routes/mbti.routes';
import customizationRoutes from './routes/customization.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Welcome to GiftGenie AI API',
        documentation: 'Visit /api/health for system status'
    });
});

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/occasions', occasionRoutes);
app.use('/api/mbti', mbtiRoutes);
app.use('/api/customization', customizationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
