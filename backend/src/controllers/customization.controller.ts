import { Request, Response } from 'express';
import prisma from '../config/db';

export const saveCustomization = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const { giftId, nameText, message, photoUrl, colorTheme, fontStyle } = req.body;

        const customization = await prisma.customization.create({
            data: {
                userId,
                giftId,
                nameText,
                message,
                photoUrl,
                colorTheme,
                fontStyle
            }
        });

        res.status(201).json({ customization });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPersonalityStyles = (req: Request, res: Response) => {
    const { type } = req.params;

    const styles: any = {
        "INTJ": {
            colorTheme: "Black and Gold",
            fontStyle: "Inter, sans-serif",
            accent: "#fbbf24",
            bg: "#1e293b"
        },
        "ENFP": {
            colorTheme: "Rainbow Gradient",
            fontStyle: "Dancing Script, cursive",
            accent: "#ec4899",
            bg: "#fdf2f8"
        },
        "ESFP": {
            colorTheme: "Bright and Bold",
            fontStyle: "Archivo Black, sans-serif",
            accent: "#f97316",
            bg: "#fff7ed"
        },
        "ISTJ": {
            colorTheme: "Navy and Silver",
            fontStyle: "Roboto Mono, monospace",
            accent: "#94a3b8",
            bg: "#0f172a"
        }
    };

    res.status(200).json(styles[type] || styles["INTJ"]);
};
