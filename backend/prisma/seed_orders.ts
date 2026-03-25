import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Admin and Sample Order...");

    // 1. Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'annu@gmail.com' },
        update: { role: 'ADMIN' },
        create: {
            email: 'annu@gmail.com',
            password: 'password123',
            name: 'Annu (Admin)',
            role: 'ADMIN'
        }
    });
    console.log("Admin ensured:", admin.email);

    // 2. Get a gift for the order
    const gift = await prisma.gift.findFirst();
    if (!gift) {
        console.error("No gifts found. Please run npm run seed first.");
        return;
    }

    // 3. Create a Customization
    const customization = await prisma.customization.create({
        data: {
            userId: admin.id,
            giftId: gift.id,
            nameText: 'Sarah Jenkins',
            message: 'To my favorite Architect',
            colorTheme: '#6366f1',
            fontStyle: 'Playfair Display',
            photoUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b'
        }
    });

    // 4. Create an Order
    const order = await prisma.order.create({
        data: {
            userId: admin.id,
            totalAmount: gift.basePrice,
            status: 'PAID',
            items: {
                create: {
                    giftId: gift.id,
                    priceAtBuy: gift.basePrice,
                    isCustomized: true,
                    customizationId: customization.id
                }
            }
        }
    });

    console.log("Sample Order Created:", order.id);
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
