import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const gifts = [
        {
            name: "Mechanical Keyboard G-Pro",
            description: "RGB backlighting, tactile switches, perfect for pro gamers and coders.",
            price: 129.99,
            category: "electronics",
            tags: ["gaming", "coding", "tech", "workstation"],
            imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2040&auto=format&fit=crop"
        },
        {
            name: "AeroPress Coffee Maker",
            description: "Brew professional-grade coffee in minutes. Ideal for travel and home.",
            price: 39.95,
            category: "home",
            tags: ["coffee", "travel", "kitchen", "morning"],
            imageUrl: "https://images.unsplash.com/photo-1515694590185-73606db99de4?q=80&w=2040&auto=format&fit=crop"
        },
        {
            name: "Noise Cancelling Headphones",
            description: "Studio quality sound with active noise cancellation for deep focus.",
            price: 299.00,
            category: "electronics",
            tags: ["music", "travel", "productivity", "tech"],
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2040&auto=format&fit=crop"
        },
        {
            name: "Smart Indoor Garden",
            description: "Automatic watering and LED light system for growing fresh herbs all year.",
            price: 89.00,
            category: "home",
            tags: ["gardening", "green", "home", "cooking"],
            imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=2000&auto=format&fit=crop"
        },
        {
            name: "Leather Minimalist Wallet",
            description: "Handcrafted top-grain leather, slim design with RFID protection.",
            price: 45.00,
            category: "fashion",
            tags: ["fashion", "leather", "classic", "accessories"],
            imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1974&auto=format&fit=crop"
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
