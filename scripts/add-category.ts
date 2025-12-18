import 'dotenv/config';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function addCategoryColumn() {
    try {
        await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Lainnya'`);
        console.log('✅ Category column added successfully!');

        await db.execute(sql`UPDATE products SET category = 'Lainnya' WHERE category IS NULL`);
        console.log('✅ Existing products updated with default category!');
    } catch (error) {
        console.error('Error:', error);
    }
    process.exit(0);
}

addCategoryColumn();
