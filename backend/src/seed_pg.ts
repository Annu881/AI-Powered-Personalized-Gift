import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function seed() {
    try {
        console.log('--- Initializing Schema ---');
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id         SERIAL PRIMARY KEY,
                name       VARCHAR(100) NOT NULL,
                email      VARCHAR(255) UNIQUE NOT NULL,
                password   VARCHAR(255) NOT NULL,
                mbti_type  VARCHAR(4),
                role       VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS gifts (
                id          VARCHAR(10) PRIMARY KEY,
                name        VARCHAR(200) NOT NULL,
                description TEXT,
                emoji       VARCHAR(10),
                price       INTEGER NOT NULL,
                category    VARCHAR(50),
                mbti_types  TEXT[],
                features    TEXT[],
                bg_gradient VARCHAR(200),
                created_at  TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS orders (
                id               SERIAL PRIMARY KEY,
                order_id         VARCHAR(50) UNIQUE NOT NULL,
                user_id          INTEGER REFERENCES users(id),
                gift_id          VARCHAR(10) REFERENCES gifts(id),
                amount           INTEGER NOT NULL,
                status           VARCHAR(30) DEFAULT 'confirmed',
                wants_custom     BOOLEAN DEFAULT FALSE,
                custom_name      VARCHAR(100),
                custom_message   TEXT,
                custom_type      VARCHAR(100),
                custom_color     VARCHAR(20),
                custom_days      INTEGER,
                custom_fee       INTEGER DEFAULT 0,
                vendor_id        INTEGER REFERENCES users(id),
                vendor_status    VARCHAR(20),
                address_name     VARCHAR(100),
                address_phone    VARCHAR(20),
                address_line1    TEXT,
                address_line2    TEXT,
                address_city     VARCHAR(100),
                address_pin      VARCHAR(10),
                address_state    VARCHAR(100),
                razorpay_order_id VARCHAR(100),
                razorpay_payment_id VARCHAR(100),
                estimated_delivery DATE,
                created_at       TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log('--- Cleaning Data ---');
        await db.query('TRUNCATE TABLE orders, gifts, users CASCADE');

        console.log('--- Seeding Users ---');
        const pass = await bcrypt.hash('password123', 12);
        await db.query(`INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
            ['Premium Gifting Co.', 'vendor@giftgenie.com', pass, 'vendor']);
        await db.query(`INSERT INTO users (name, email, password, role, mbti_type) VALUES ($1, $2, $3, $4, $5)`,
            ['John Doe', 'user@example.com', pass, 'user', 'INTJ']);

        console.log('--- Seeding Gifts ---');
        const gifts = [
            { id: 'GT-X01', name: 'Premium Mechanical Keyboard', category: 'Personality', price: 4200, mbti_types: ['INTJ'], description: 'Precision engineered for the strategic mind.', emoji: '⌨️', bg_gradient: 'from-slate-900 to-slate-800' },
            { id: 'GT-X02', name: 'Vibrant DIY Art Kit', category: 'Anniversary', price: 1200, mbti_types: ['ENFP'], description: 'A canvas of endless creative potential.', emoji: '🎨', bg_gradient: 'from-rose-900 to-rose-800' },
            { id: 'GT-X03', name: 'Personal Glow Night Light', category: 'Anniversary', price: 899, mbti_types: ['ISFP'], description: 'Soften your space with a personalized glow.', emoji: '💡', bg_gradient: 'from-amber-900 to-amber-800' },
            { id: 'GT-X04', name: 'Whiskey Decanter Presentation Set', category: 'Promotional', price: 4500, mbti_types: ['ENTJ'], description: 'A trophy of achievement for the ambitious leader.', emoji: '🥃', bg_gradient: 'from-slate-950 to-slate-900' },
            { id: 'GT-X05', name: 'Multi-Device Power Station', category: 'Promotional', price: 2800, mbti_types: ['INTP'], description: 'Uninterrupted power for the infinite researcher.', emoji: '⚡', bg_gradient: 'from-blue-950 to-blue-900' },
            { id: 'GT-X06', name: 'Leather Desk Mat', category: 'Promotional', price: 1500, mbti_types: ['ISTJ'], description: 'Luxury organization for the orderly perfectionist.', emoji: '📁', bg_gradient: 'from-stone-900 to-stone-800' },
            { id: 'GT-X07', name: 'Ceramic Marble Mugs', category: 'Anniversary', price: 729, mbti_types: ['ISFJ'], description: 'Timeless warmth for the dedicated protector.', emoji: '☕', bg_gradient: 'from-neutral-900 to-neutral-800' },
            { id: 'GT-X08', name: 'Fridge Magnets (Custom)', category: 'Anniversary', price: 249, mbti_types: ['ENFP'], description: 'Small moments, big memories.', emoji: '🧲', bg_gradient: 'from-pink-900 to-pink-800' },
            { id: 'GT-X09', name: '5-in-1 Leather Clutch', category: 'Anniversary', price: 1995, mbti_types: ['ESTJ'], description: 'Classic elegance for the decisive executive.', emoji: '👛', bg_gradient: 'from-brown-900 to-brown-800' },
            { id: 'GT-X10', name: 'Photo Glow Lamp', category: 'Anniversary', price: 1199, mbti_types: ['ESFP'], description: 'Illuminate your most vibrant memories.', emoji: '📸', bg_gradient: 'from-yellow-900 to-yellow-800' },
            { id: 'GT-X11', name: 'Wooden Bottle Box', category: 'Anniversary', price: 3899, mbti_types: ['ENFJ'], description: 'A sophisticated tribute to shared success.', emoji: '🍾', bg_gradient: 'from-emerald-900 to-emerald-800' },
            { id: 'GT-X12', name: 'Personalized Beer Stein', category: 'Promotional', price: 1200, mbti_types: ['ESTP'], description: 'A bold vessel for the spontaneous entrepreneur.', emoji: '🍺', bg_gradient: 'from-orange-900 to-orange-800' },
            { id: 'GT-X13', name: 'Precision Watch Tool Kit', category: 'Promotional', price: 3200, mbti_types: ['ISTP'], description: 'The ultimate tool for the technical virtuoso.', emoji: '⌚', bg_gradient: 'from-cyan-950 to-cyan-900' },
            { id: 'GT-X14', name: 'Engraved Wooden Watch', category: 'Promotional', price: 2500, mbti_types: ['INFP'], description: 'Timeless style for the poetic mediator.', emoji: '🕒', bg_gradient: 'from-teal-900 to-teal-800' },
        ];

        for (const g of gifts) {
            await db.query(`
                INSERT INTO gifts (id, name, description, emoji, price, category, mbti_types, bg_gradient)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [g.id, g.name, g.description, g.emoji, g.price, g.category, g.mbti_types, g.bg_gradient]
            );
        }

        console.log('✓ Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
