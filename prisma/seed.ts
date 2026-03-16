import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL }) as any;
const adapter = new PrismaPg(pool) as any;
const prisma = new PrismaClient({ adapter });

async function main() {
    const gifts = [
        {
            name: "Pro Chess Set",
            description: "High-quality wooden chess set for strategic thinkers.",
            price: 89.99,
            category: "home",
            tags: ["strategy", "logic", "games"],
            mbtiType: "INTJ",
            imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2044&auto=format&fit=crop"
        },
        {
            name: "Professional Art Kit",
            description: "Complete set of watercolors and brushes for creative souls.",
            price: 54.99,
            category: "home",
            tags: ["art", "creative", "painting"],
            mbtiType: "ENFP",
            imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2041&auto=format&fit=crop"
        },
        {
            name: "Party Gadget Box",
            description: "Everything you need for a bold, lively celebration.",
            price: 120.00,
            category: "electronics",
            tags: ["party", "fun", "social"],
            mbtiType: "ESFP",
            imageUrl: "https://images.unsplash.com/photo-1514525253344-76343e230b80?q=80&w=2040&auto=format&fit=crop"
        },
        {
            name: "Minimalist Planner 2026",
            description: "Structured organizer for the reliable and focused mind.",
            price: 29.50,
            category: "home",
            tags: ["organized", "productivity", "classic"],
            mbtiType: "ISTJ",
            imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2000&auto=format&fit=crop"
        }
    ];

    console.log("Seeding database...");

    for (const gift of gifts) {
        await prisma.gift.create({
            data: gift
        });
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
