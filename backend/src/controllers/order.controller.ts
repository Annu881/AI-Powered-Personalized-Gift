import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, items } = req.body; // items: [{ giftId, customizationId }]

        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const gift = await prisma.gift.findUnique({ where: { id: item.giftId } });
            if (!gift) continue;

            let itemPrice = gift.basePrice;
            let isCustomized = false;

            if (item.customizationId) {
                const cust = await prisma.customization.findUnique({ where: { id: item.customizationId } });
                if (cust && cust.status === 'APPROVED') {
                    itemPrice += gift.customPrice;
                    isCustomized = true;
                }
            }

            totalAmount += itemPrice;
            orderItemsData.push({
                giftId: gift.id,
                isCustomized,
                customizationId: item.customizationId || null,
                priceAtBuy: itemPrice
            });
        }

        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: 'UNPAID',
                items: {
                    create: orderItemsData
                }
            },
            include: { items: true }
        });

        res.status(201).json({ message: 'Order created', order });
    } catch (err) {
        res.status(500).json({ error: 'Order creation failed' });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                items: {
                    include: {
                        gift: true,
                        customization: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const getOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { items: { include: { gift: true } } }
        });
        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ error: 'Order not found' });
    }
};
