const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function check() {
    try {
        const res = await pool.query(`SELECT email, password FROM users`);
        console.log('User Passwords:');
        res.rows.forEach(row => {
            const isHashed = row.password.startsWith('$2');
            console.log(`${row.email}: ${row.password.substring(0, 10)}... (Length: ${row.password.length}, Hashed: ${isHashed})`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
