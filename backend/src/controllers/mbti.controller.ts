import { Request, Response } from 'express';
import prisma from '../config/db';
import { predictMBTI } from '../utils/mlConnector';

export const processQuiz = async (req: Request, res: Response) => {
    try {
        const { answers, userId } = req.body; // answers is an array of strings

        if (!answers || Object.keys(answers).length < 10) {
            return res.status(400).json({ error: 'Please answer all 10 questions for a precise analysis.' });
        }

        // Aggregate answers into a text block for ML prediction
        // Dimensions: Context, Budget, JP, EI, SN, TF
        const answerText = Object.values(answers).join(" ");

        // Call the real ML model
        const predictedType = await predictMBTI(answerText);

        // Update user's MBTI type if userId is provided
        if (userId) {
            await prisma.user.update({
                where: { id: Number(userId) },
                data: { mbtiType: predictedType }
            });
        }

        res.status(200).json({
            message: 'Quiz processed successfully',
            mbtiType: predictedType
        });
    } catch (error: any) {
        console.error('Quiz processing error:', error);
        console.error('Quiz processing stack:', error.stack);
        res.status(500).json({ error: 'Failed to process personality traits: ' + error.message });
    }
};

function getPersonalityDescription(type: string): string {
    const desc: any = {
        "INTJ": "Strategic Mastermind - Professional, minimal, and logical.",
        "ENFP": "Creative Visionary - Energetic, colorful, and inspired.",
        "ESFP": "Lively Performer - Fun, bold, and outgoing.",
        "ISTJ": "Reliable Organizer - Practical, focused, and monogrammed."
    };
    return desc[type] || "Unique Personality - Personalized just for you.";
}
