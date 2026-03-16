import { Request, Response } from 'express';
import prisma from '../config/db';

// Simple scoring for the 4 MBTI dimensions
// E vs I, S vs N, T vs F, J vs P
export const processQuiz = async (req: any, res: Response) => {
    try {
        const { answers } = req.body; // Array of 10 answers (e.g., ['E', 'N', 'F', 'P', ...])

        if (!answers || answers.length < 10) {
            return res.status(400).json({ error: 'Please answer all 10 questions.' });
        }

        // Calculate counts
        let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        answers.forEach((ans: string) => {
            if (scores.hasOwnProperty(ans)) {
                (scores as any)[ans]++;
            }
        });

        // Determine personality
        let personality = "";
        personality += scores.E >= scores.I ? "E" : "I";
        personality += scores.N >= scores.S ? "N" : "S"; // Favoring Intuition for AI vibe
        personality += scores.T >= scores.F ? "T" : "F";
        personality += scores.J >= scores.P ? "J" : "P";

        // Save to user if logged in
        if (req.userId) {
            await prisma.user.update({
                where: { id: req.userId },
                data: { mbtiType: personality }
            });
        }

        res.status(200).json({ personality, description: getPersonalityDescription(personality) });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
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
