import { db, products, userRoles } from "./lib/db";

async function seed() {
    console.log("🌱 Seeding database...");

    // Seed sample products
    console.log("📦 Creating sample products...");

    const sampleProducts = [
        {
            name: "Beras Premium 5kg",
            description: "Beras putih premium kualitas tinggi, pulen dan wangi. Cocok untuk konsumsi sehari-hari.",
            price: "75",
            stock: 50,
            imageUrl: null,
        },
        {
            name: "Minyak Goreng 2L",
            description: "Minyak goreng nabati berkualitas, jernih dan tidak cepat hitam.",
            price: "35",
            stock: 100,
        },
        {
            name: "Gula Pasir 1kg",
            description: "Gula pasir putih kristal, manis sempurna untuk memasak dan minuman.",
            price: "15",
            stock: 80,
        },
        {
            name: "Tepung Terigu 1kg",
            description: "Tepung terigu serbaguna untuk berbagai kebutuhan memasak dan membuat kue.",
            price: "12",
            stock: 60,
        },
        {
            name: "Kopi Bubuk 200gr",
            description: "Kopi bubuk asli pilihan, aroma kuat dan rasa nikmat.",
            price: "25",
            stock: 40,
        },
        {
            name: "Teh Celup isi 25",
            description: "Teh celup praktis dengan rasa segar dan aroma harum.",
            price: "8",
            stock: 120,
        },
        {
            name: "Susu UHT 1L",
            description: "Susu segar UHT full cream, kaya nutrisi untuk keluarga.",
            price: "18",
            stock: 75,
        },
        {
            name: "Mie Instan (5 pack)",
            description: "Mie instan favorit dengan berbagai rasa, praktis dan lezat.",
            price: "15",
            stock: 200,
        },
        {
            name: "Sabun Mandi 100gr",
            description: "Sabun mandi dengan wangi segar, menjaga kulit sehat.",
            price: "5",
            stock: 150,
        },
        {
            name: "Shampo Sachet (12 pcs)",
            description: "Shampo dalam kemasan sachet, praktis untuk perjalanan.",
            price: "12",
            stock: 100,
        },
        {
            name: "Deterjen Bubuk 1kg",
            description: "Deterjen bubuk untuk mencuci bersih dan wangi tahan lama.",
            price: "22",
            stock: 60,
        },
        {
            name: "Telur Ayam 1 Tray",
            description: "Telur ayam segar, kualitas terjamin dari peternak lokal.",
            price: "45",
            stock: 30,
        },
    ];

    for (const product of sampleProducts) {
        await db.insert(products).values(product);
        console.log(`  ✓ Created: ${product.name}`);
    }

    console.log("\n✅ Seeding completed!");
    console.log("\n📝 Note: To create admin/staff accounts:");
    console.log("   1. Register users via /register page");
    console.log("   2. Add their roles with SQL below:\n");
    console.log(`
-- After users register, get their user_id from auth.users table
-- Then insert roles:

INSERT INTO user_roles (user_id, role) VALUES
  ('USER_ID_HERE', 'admin'),   -- Replace with actual user ID
  ('USER_ID_HERE', 'staff');   -- Replace with actual user ID
  `);

    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
