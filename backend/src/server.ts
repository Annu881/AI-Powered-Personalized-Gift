import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import { Pool } from 'pg';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);

// -- Middleware ----------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// -- Database ------------------------------------------------
console.log('--- DB CONFIG ---');
console.log('URL Prefix:', process.env.DATABASE_URL?.substring(0, 30) + '...');
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 60000,
    max: 20
});

db.on('error', (err) => console.error('Unexpected pool error:', err));

// -- Razorpay ------------------------------------------------
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// -- Auth Middleware -----------------------------------------
interface AuthRequest extends Request {
    user?: any;
}

function auth(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') return res.status(401).json({ error: 'No token' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
        next();
        return;
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch { } // ignore invalid token for optional auth
    next();
}

// ============================================================
// DATABASE SETUP
// ============================================================
async function setupDB() {
    try {
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
        console.log('✓ Database tables ready');
    } catch (err) {
        console.error('Database setup error (ensure PostgreSQL is running and DB exists):', err);
    }
}

// ============================================================
// AUTH ROUTES
// ============================================================

app.post('/api/auth/signup', async (req, res) => {
    try {
        console.log('--- Signup Attempt ---');
        console.log('Body:', req.body);
        const { name, email, password, role = 'user', mbti_type } = req.body;

        if (!name || !email || !password) {
            console.log('Validation failed: Missing fields');
            return res.status(400).json({ error: 'All fields required' });
        }
        if (password.length < 8) {
            console.log('Validation failed: Password too short');
            return res.status(400).json({ error: 'Password min 8 chars' });
        }

        const exists = await db.query('SELECT id FROM users WHERE email=$1', [email]);
        if (exists.rows.length > 0) {
            console.log('Validation failed: Email exists');
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hash = await bcrypt.hash(password, 12);
        const result = await db.query(
            'INSERT INTO users (name, email, password, role, mbti_type) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role, mbti_type',
            [name, email, hash, role, mbti_type]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        console.log('✓ Signup successful for:', email);
        res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role, mbti_type: user.mbti_type } });
    } catch (err: any) {
        console.error('Signup Error:', err);
        try {
            require('fs').appendFileSync('/home/annu/Downloads/Ai powered personalized gift/backend/error.log',
                `\n[${new Date().toISOString()}] Signup Error: ${err.stack}\n`);
        } catch { }
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, mbti_type } = req.body;
        const result = await db.query('SELECT * FROM users WHERE email=$1', [email]);
        if (result.rows.length === 0)
            return res.status(401).json({ error: 'Invalid credentials' });

        const user = result.rows[0];
        if (!user.password || !user.password.startsWith('$2')) {
            console.error('Invalid password hash for user:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        if (mbti_type && !user.mbti_type) {
            await db.query('UPDATE users SET mbti_type=$1 WHERE id=$2', [mbti_type, user.id]);
app.get('/api/auth/me', auth, async (req: AuthRequest, res) => {    try {        const result = await db.query('SELECT id, name, email, role, mbti_type FROM users WHERE id=$1', [req.user.id]);        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });        res.json({ success: true, user: result.rows[0] });    } catch (err: any) {        res.status(500).json({ error: err.message });    }});
            user.mbti_type = mbti_type;
        }

        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role, mbti_type: user.mbti_type } });
    } catch (err: any) {
        console.error('--- LOGIN ERROR ---', err);
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// MBTI QUIZ
// ============================================================

app.post('/api/quiz/predict', optionalAuth, async (req: AuthRequest, res) => {
    try {
        const { answers } = req.body;
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Invalid answers format' });
        }

        // Call Flask ML service
        let mbtiType, confidence = 0.85;
        try {
            const mlResponse = await fetch(`http://localhost:${process.env.ML_PORT}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers }),
            });

            if (mlResponse.ok) {
                const mlData: any = await mlResponse.json();
                mbtiType = mlData.mbti_type;
                confidence = mlData.confidence;
            } else {
                throw new Error('ML service returned error status');
            }
        } catch (mlErr) {
            console.error('ML service failed, using fallback:', mlErr);
            // Fallback: simple rule-based prediction
            // Skip first 2 answers (Occasion, Budget)
            const scores: any = { E: 0, I: 0, T: 0, F: 0, S: 0, N: 0, J: 0, P: 0 };
            const mbtiAnswers = answers.slice(2);
            const dims = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P'], ['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']];

            mbtiAnswers.forEach((a: any, i: number) => {
                const d = dims[i] || ['E', 'I'];
                if (a === 0) scores[d[0]]++; else scores[d[1]]++;
            });
            mbtiType = (scores.E >= scores.I ? 'E' : 'I') + (scores.S >= scores.N ? 'S' : 'N') + (scores.T >= scores.F ? 'T' : 'F') + (scores.J >= scores.P ? 'J' : 'P');
        }

        if (req.user && req.user.id && mbtiType) {
            await db.query('UPDATE users SET mbti_type=$1 WHERE id=$2', [mbtiType, req.user.id]);
        }
        res.json({ success: true, mbti_type: mbtiType, confidence });
    } catch (err: any) {
        console.error('CRITICAL PREDICTION ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// GIFTS
// ============================================================

app.get('/api/gifts', optionalAuth, async (req, res) => {
    try {
        const { mbti } = req.query;
        let query, params: any[] = [];
        if (mbti) {
            query = 'SELECT * FROM gifts WHERE $1 = ANY(mbti_types) ORDER BY id LIMIT 5';
            params = [mbti];
        } else {
            query = 'SELECT * FROM gifts LIMIT 10';
        }
        const result = await db.query(query, params);
        res.json({ success: true, gifts: result.rows });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/gifts/:id', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM gifts WHERE id=$1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Gift not found' });
        res.json({ success: true, gift: result.rows[0] });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// ORDERS
// ============================================================

app.post('/api/orders/create', auth, async (req: AuthRequest, res) => {
    try {
        const {
            gift_id, amount, wants_custom, custom_name, custom_message,
            custom_type, custom_color, custom_days, custom_fee,
            address_name, address_phone, address_line1,
            address_line2, address_city, address_pin, address_state
        } = req.body;

        const orderId = 'GM-' + Date.now();
        const delivDays = wants_custom ? (custom_days || 7) + 3 : 5;
        const delivDate = new Date();
        delivDate.setDate(delivDate.getDate() + delivDays);

        let rzpOrder;
        if (process.env.RAZORPAY_KEY_ID?.includes('your_key_id')) {
            console.log('--- MOCK RAZORPAY MODE ---');
            rzpOrder = { id: 'order_mock_' + Date.now(), amount: Math.round(amount * 100) };
        } else {
            rzpOrder = await razorpay.orders.create({
                amount: Math.round(amount * 100),
                currency: 'INR',
                receipt: orderId,
                notes: { order_id: orderId, user_id: req.user.id },
            });
        }

        const result = await db.query(`
      INSERT INTO orders (
        order_id, user_id, gift_id, amount, wants_custom,
        custom_name, custom_message, custom_type, custom_color, custom_days, custom_fee,
        address_name, address_phone, address_line1, address_line2,
        address_city, address_pin, address_state,
        razorpay_order_id, estimated_delivery,
        vendor_status, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
      RETURNING *`,
            [
                orderId, req.user.id, gift_id, amount, wants_custom,
                custom_name, custom_message, custom_type, custom_color, custom_days, custom_fee,
                address_name, address_phone, address_line1, address_line2,
                address_city, address_pin, address_state,
                rzpOrder.id, delivDate.toISOString().split('T')[0],
                wants_custom ? 'pending' : null,
                'confirmed'
            ]
        );

        res.json({
            success: true,
            order: result.rows[0],
            razorpay_order_id: rzpOrder.id,
            razorpay_key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (err: any) {
        console.error('--- ORDER ERROR ---', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/orders/verify-payment', auth, async (req, res) => {
    try {
        const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string).update(body).digest('hex');

        if (expected !== razorpay_signature) {
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        await db.query(
            'UPDATE orders SET razorpay_payment_id=$1, status=$2 WHERE order_id=$3',
            [razorpay_payment_id, 'confirmed', order_id]
        );

        res.json({ success: true, message: 'Payment verified successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders', auth, async (req: AuthRequest, res) => {
    try {
        const result = await db.query(
            `SELECT o.*, g.name AS gift_name, g.emoji, g.price
       FROM orders o JOIN gifts g ON o.gift_id = g.id
       WHERE o.user_id = $1 ORDER BY o.created_at DESC`,
            [req.user.id]
        );
        res.json({ success: true, orders: result.rows });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders/:id', auth, async (req: AuthRequest, res) => {
    try {
        const result = await db.query(
            `SELECT o.*, g.name AS gift_name, g.emoji
       FROM orders o JOIN gifts g ON o.gift_id = g.id
       WHERE o.order_id=$1 AND o.user_id=$2`,
            [req.params.id, req.user.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, order: result.rows[0] });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// VENDOR ROUTES
// ============================================================

app.get('/api/vendor/orders', auth, async (req: AuthRequest, res) => {
    try {
        if (req.user.role !== 'vendor') return res.status(403).json({ error: 'Vendor access only' });
        const result = await db.query(
            `SELECT o.*, g.name AS gift_name, u.name AS customer_name, u.email AS customer_email, u.mbti_type AS customer_mbti
       FROM orders o
       JOIN gifts g ON o.gift_id = g.id
       JOIN users u ON o.user_id = u.id
       WHERE o.wants_custom = TRUE
       ORDER BY o.created_at DESC`
        );
        res.json({ success: true, orders: result.rows });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/vendor/orders/:id', auth, async (req: AuthRequest, res) => {
    try {
        if (req.user.role !== 'vendor') return res.status(403).json({ error: 'Vendor access only' });
        const { action } = req.body;

        let vendorStatus, orderStatus;
        if (action === 'accept') { vendorStatus = 'accepted'; orderStatus = 'customizing'; }
        if (action === 'reject') { vendorStatus = 'rejected'; orderStatus = 'confirmed'; }
        if (action === 'ship') { vendorStatus = 'accepted'; orderStatus = 'shipped'; }

        await db.query(
            'UPDATE orders SET vendor_status=$1, status=$2, vendor_id=$3 WHERE order_id=$4',
            [vendorStatus, orderStatus, req.user.id, req.params.id]
        );

        res.json({ success: true, message: `Order ${action}ed successfully` });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/vendor/stats', auth, async (req: AuthRequest, res) => {
    try {
        if (req.user.role !== 'vendor') return res.status(403).json({ error: 'Vendor access only' });
        const total = await db.query('SELECT COUNT(*) FROM orders WHERE wants_custom=TRUE');
        const pending = await db.query("SELECT COUNT(*) FROM orders WHERE vendor_status='pending'");
        const revenue = await db.query("SELECT SUM(amount) FROM orders WHERE vendor_id=$1 AND status='shipped'", [req.user.id]);
        res.json({
            success: true,
            stats: {
                total_orders: parseInt(total.rows[0].count),
                pending_review: parseInt(pending.rows[0].count),
                revenue: parseInt(revenue.rows[0].sum || '0'),
                avg_rating: 4.9,
            }
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// -- START ---------------------------------------------------
app.listen(PORT, async () => {
    await setupDB();
    console.log(`\n✦ GiftGenie Backend running on port ${PORT}`);
});

export default app;
