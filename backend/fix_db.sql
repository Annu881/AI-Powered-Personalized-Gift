-- Run this as a PostgreSQL superuser to align your local DB with the GiftGenie config
-- Command: sudo -u postgres psql -f fix_db.sql

-- 1. Set the password to match .env
ALTER USER postgres WITH PASSWORD 'password';

-- 2. Create the database if it doesn't exist
SELECT 'CREATE DATABASE giftmind'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'giftmind')\gexec

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE giftmind TO postgres;

\q
