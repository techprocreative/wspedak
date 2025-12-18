import { pgTable, uuid, text, numeric, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// Products Table
// ============================================
export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    name: text('name').notNull(),
    description: text('description'),
    price: numeric('price').notNull(),
    imageUrl: text('image_url'),
    stock: integer('stock').default(0),
    category: text('category').default('Lainnya'),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// ============================================
// Orders Table
// ============================================
export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    customerName: text('customer_name').notNull(),
    customerAddress: text('customer_address').notNull(),
    customerPhone: text('customer_phone'),
    totalAmount: numeric('total_amount').notNull(),
    status: text('status').default('pending'),
    whatsappSent: boolean('whatsapp_sent').default(false),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

// ============================================
// Order Items Table
// ============================================
export const orderItems = pgTable('order_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
    productName: text('product_name').notNull(),
    quantity: integer('quantity').notNull(),
    price: numeric('price').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

// ============================================
// User Roles Table
// ============================================
export const userRoles = pgTable('user_roles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    role: text('role').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;

// ============================================
// Relations
// ============================================
export const ordersRelations = relations(orders, ({ many }) => ({
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));
