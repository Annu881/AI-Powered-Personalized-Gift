import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/db';

export const createOccasion = async (req: AuthRequest, res: Response) => {
    try {
        const { name, date, giftId } = req.body;
        const userId = req.userId!;

        const occasion = await prisma.occasion.create({
            data: {
                name,
                date: new Date(date),
                userId,
                giftId: giftId ? parseInt(giftId) : undefined
            }
        });

        res.status(201).json({ occasion });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getOccasions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const occasions = await prisma.occasion.findMany({
            where: { userId },
            include: { gift: true }
        });
        res.status(200).json({ occasions });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteOccasion = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId!;

        await prisma.occasion.deleteMany({
            where: { id: parseInt(id), userId }
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
