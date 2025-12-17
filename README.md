# Toserba WS Pedak E-commerce

Platform e-commerce untuk toko serba ada "Toserba WS Pedak" - **Murah • Lengkap • Luas**

## 🚀 Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod

## ✨ Features

### Customer
- 🛒 Browse products catalog
- 🛍️ Shopping cart (persisted locally)
- 📱 WhatsApp checkout with order ID tracking
- 📦 Order history dashboard
- 📍 Contact & store info

### Admin
- 📊 Dashboard with real-time statistics
- 📝 Product management (CRUD)
- 📋 Order management with status updates
- 👥 Staff role management

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Installation

```bash
# Clone repository
git clone <repo-url>
cd wspedak

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your Supabase credentials
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WHATSAPP_NUMBER=6281239602221
NEXT_PUBLIC_STORE_PHONE=6281239602221
NEXT_PUBLIC_STORE_EMAIL=nedhms@gmail.com
```

### Database Setup

Run migrations in Supabase SQL Editor:

```bash
# Apply migrations in order
supabase/migrations/20251021171053_create_products_table.sql
supabase/migrations/20251217120002_create_user_roles.sql
supabase/migrations/20251217120003_create_orders.sql
```

Or use Supabase CLI:
```bash
supabase link --project-ref <project-id>
supabase db push
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
wspedak/
├── app/                    # Next.js pages
│   ├── admin/             # Admin panel
│   │   ├── dashboard/     # Dashboard with stats
│   │   ├── orders/        # Order management
│   │   └── new/           # Add product
│   ├── checkout/          # Checkout page
│   ├── contact/           # Contact page
│   ├── dashboard/         # User order history
│   ├── login/             # Admin login
│   └── products/          # Products catalog
├── components/            # React components
│   ├── admin/             # Admin-specific
│   └── ui/                # shadcn/ui
├── lib/                   # Utilities
│   ├── supabase/          # Supabase clients
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript types
└── supabase/
    └── migrations/        # Database migrations
```

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy!

## 📝 License

MIT License

---

**Toserba WS Pedak** - Murah • Lengkap • Luas
