import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./dev.db'
        }
    }
});

async function main() {
    console.log("Cleaning database...");
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customization.deleteMany();
    await prisma.gift.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.user.deleteMany();

    console.log("Seeding vendors...");
    const vendor = await prisma.vendor.create({
        data: {
            email: 'premium_gifts@vendor.com',
            password: 'password123', // In production, use bcrypt
            name: 'Premium Gifting Co.'
        }
    });

    console.log("Seeding users...");
    await prisma.user.create({
        data: {
            email: 'user@example.com',
            password: 'password123',
            name: 'John Doe',
            mbtiType: 'INTJ'
        }
    });

    const gifts = [
        { name: "Grandmaster Chess Set", description: "Handcrafted Sheesham wood chess set for the strategic Mastermind.", basePrice: 4500.00, customPrice: 499.00, category: "home", tags: ["strategy", "logic", "games"], mbtiType: "INTJ", imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2044", vendorId: vendor.id, status: "APPROVED" },
        { name: "Artisan Watercolor Set", description: "Premium 48-shade watercolor palette for the creative Champion.", basePrice: 2000.00, customPrice: 499.00, category: "home", tags: ["art", "creative", "painting"], mbtiType: "ENFP", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2041", vendorId: vendor.id, status: "APPROVED" },
        { name: "Smart Party Speaker", description: "High-bass RGB speaker for the life of the party.", basePrice: 8500.00, customPrice: 499.00, category: "electronics", tags: ["party", "fun", "social"], mbtiType: "ESFP", imageUrl: "https://images.unsplash.com/photo-1514525253344-76343e230b80?q=80&w=2040", vendorId: vendor.id, status: "APPROVED" },
        { name: "Zen Productivity Planner", description: "Eco-friendly structured organizer for the reliable Logistician.", basePrice: 1000.00, customPrice: 299.00, category: "home", tags: ["organized", "productivity", "classic"], mbtiType: "ISTJ", imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Vintage Leather Journal", description: "Exquisite bound journal for the insightful Counselor.", basePrice: 1800.00, customPrice: 399.00, category: "home", tags: ["journal", "writing", "insight"], mbtiType: "INFJ", imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Modern Desk Sculpture", description: "Abstract geometric sculpture for the focused Architect.", basePrice: 3200.00, customPrice: 599.00, category: "decor", tags: ["art", "modern", "design"], mbtiType: "INTP", imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Bamboo Essential Oil Diffuser", description: "Calming aromatherapy for the empathetic Mediator.", basePrice: 2500.00, customPrice: 450.00, category: "wellness", tags: ["peace", "harmony", "scent"], mbtiType: "INFP", imageUrl: "https://images.unsplash.com/photo-1544133782-b4212bc7193c?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Precision Tool Kit", description: "High-grade mechanical set for the analytical Virtuoso.", basePrice: 5500.00, customPrice: 999.00, category: "tools", tags: ["mechanic", "diy", "precision"], mbtiType: "ISTP", imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Ceramic Tea Ceremony Set", description: "Handcrafted tea set for the gentle Adventurer.", basePrice: 2800.00, customPrice: 400.00, category: "home", tags: ["tradition", "peace", "tea"], mbtiType: "ISFP", imageUrl: "https://images.unsplash.com/photo-1515696955266-4f67e13219e8?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Luxurious Cashmere Throw", description: "Ultra-soft blanket for the nurturing Defender.", basePrice: 6000.00, customPrice: 800.00, category: "home", tags: ["comfort", "warmth", "luxury"], mbtiType: "ISFJ", imageUrl: "https://images.unsplash.com/photo-1520608421741-68228b76b6df?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Acoustic Guitar Starter Kit", description: "Quality guitar set for the energetic Entertainer.", basePrice: 12000.00, customPrice: 1500.00, category: "music", tags: ["music", "fun", "creative"], mbtiType: "ESFP", imageUrl: "https://images.unsplash.com/photo-1550291652-6ea9114a47bd?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Smart Fitness Watch", description: "Next-gen tracker for the dynamic Dynamo.", basePrice: 18000.00, customPrice: 2000.00, category: "electronics", tags: ["fitness", "tech", "action"], mbtiType: "ESTP", imageUrl: "https://images.unsplash.com/photo-1544117518-e7963214decb?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Premium Leather Briefcase", description: "Executive case for the powerful Commander.", basePrice: 9500.00, customPrice: 1200.00, category: "fashion", tags: ["professional", "status", "classic"], mbtiType: "ENTJ", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Smart Home Hub", description: "Centralized control for the efficient Executive.", basePrice: 7500.00, customPrice: 900.00, category: "electronics", tags: ["efficiency", "home", "tech"], mbtiType: "ESTJ", imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Gourmet Gift Basket", description: "Premium artisanal snacks for the social Provider.", basePrice: 3500.00, customPrice: 500.00, category: "food", tags: ["sharing", "luxury", "food"], mbtiType: "ESFJ", imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Inspirational Leadership Book", description: "Collector's edition for the motivating Giver.", basePrice: 1200.00, customPrice: 200.00, category: "books", tags: ["inspiration", "leader", "growth"], mbtiType: "ENFJ", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" },
        { name: "Electronic Lab Kit", description: "Experimental electronics for the curious Debater.", basePrice: 4800.00, customPrice: 600.00, category: "electronics", tags: ["experiment", "tech", "learning"], mbtiType: "ENTP", imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2000", vendorId: vendor.id, status: "APPROVED" }
    ];

    console.log("Seeding gifts...");
    for (const gift of gifts) {
        await prisma.gift.create({
            data: {
                ...gift,
                tags: Array.isArray(gift.tags) ? gift.tags.join(",") : gift.tags
            } as any
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
