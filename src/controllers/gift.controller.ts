import { Request, Response } from 'express';
import prisma from '../config/db';

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { occasion, category, minPrice, maxPrice, interests } = req.query;

        // Base query
        let query: any = {
            where: {}
        };

        if (category) {
            query.where.category = category as string;
        }

        if (minPrice || maxPrice) {
            query.where.price = {};
            if (minPrice) query.where.price.gte = parseFloat(minPrice as string);
            if (maxPrice) query.where.price.lte = parseFloat(maxPrice as string);
        }

        if (interests) {
            const interestList = (interests as string).split(',');
            query.where.tags = {
                hasSome: interestList
            };
        }

        const gifts = await prisma.gift.findMany(query);

        res.status(200).json({ gifts });
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
