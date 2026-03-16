import { Request, Response } from 'express';
import prisma from '../config/db';

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { occasion, category, minPrice, maxPrice, interests, limit, mbtiType } = req.query;

        let where: any = {};

        if (category) {
            where.category = { contains: category as string, mode: 'insensitive' };
        }

        if (mbtiType) {
            where.mbtiType = mbtiType as string;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice as string);
            if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
        }

        if (interests) {
            const interestList = (interests as string).split(/[ ,]+/).filter(i => i.length > 2);
            if (interestList.length > 0) {
                where.OR = [
                    { tags: { hasSome: interestList } },
                    { description: { contains: interestList[0], mode: 'insensitive' } },
                    { name: { contains: interestList[0], mode: 'insensitive' } }
                ];
            }
        }

        const gifts = await prisma.gift.findMany({
            where,
            take: limit ? parseInt(limit as string) : 10,
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ gifts });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const toggleFavorite = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const { giftId } = req.body;

        const existing = await prisma.favorite.findUnique({
            where: { userId_giftId: { userId, giftId } }
        });

        if (existing) {
            await prisma.favorite.delete({ where: { id: existing.id } });
            return res.status(200).json({ status: 'removed' });
        } else {
            await prisma.favorite.create({ data: { userId, giftId } });
            return res.status(201).json({ status: 'added' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getFavorites = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: { gift: true }
        });
        res.status(200).json({ gifts: favorites.map(f => f.gift) });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createGift = async (req: Request, res: Response) => {
    try {
        const { name, description, price, category, tags, imageUrl } = req.body;

        const gift = await prisma.gift.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                tags,
                imageUrl
            }
        });

        res.status(201).json({ gift });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
