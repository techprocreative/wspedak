import 'dotenv/config';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function createCategoriesTable() {
    try {
        // Create categories table
        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
        console.log('✅ Categories table created successfully!');

        // Insert default categories
        const defaultCategories = [
            { name: 'Sembako', description: 'Sembilan bahan pokok' },
            { name: 'Minuman', description: 'Minuman kemasan dan segar' },
            { name: 'Makanan Ringan', description: 'Snack dan camilan' },
            { name: 'Peralatan Rumah Tangga', description: 'Peralatan untuk rumah tangga' },
            { name: 'Kosmetik & Perawatan', description: 'Produk kecantikan dan perawatan tubuh' },
            { name: 'Lainnya', description: 'Kategori lain-lain' },
        ];

        for (const cat of defaultCategories) {
            await db.execute(sql`
        INSERT INTO categories (name, description)
        VALUES (${cat.name}, ${cat.description})
        ON CONFLICT (name) DO NOTHING
      `);
        }
        console.log('✅ Default categories inserted!');

    } catch (error) {
        console.error('Error:', error);
    }
    process.exit(0);
}

createCategoriesTable();
