import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPendingCustomizations = async (req: Request, res: Response) => {
    try {
        const { vendorId } = req.query;
        const pending = await prisma.customization.findMany({
            where: {
                status: 'PENDING',
                gift: { vendorId: Number(vendorId) }
            },
            include: { gift: true, user: true }
        });
        res.status(200).json({ pending });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch pending customizations' });
    }
};

export const approveCustomization = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { vendorNote } = req.body;

        const updated = await prisma.customization.update({
            where: { id: Number(id) },
            data: {
                status: 'APPROVED',
                approvalDate: new Date(),
                vendorNote
            }
        });

        res.status(200).json({ message: 'Customization Approved', updated });
    } catch (err) {
        res.status(500).json({ error: 'Approval failed' });
    }
};

export const rejectCustomization = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { vendorNote } = req.body;

        const updated = await prisma.customization.update({
            where: { id: Number(id) },
            data: {
                status: 'REJECTED',
                vendorNote
            }
        });

        res.status(200).json({ message: 'Customization Rejected', updated });
    } catch (err) {
        res.status(500).json({ error: 'Rejection failed' });
    }
};
