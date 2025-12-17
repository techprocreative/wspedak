export interface Order {
    id: string;
    customer_name: string;
    customer_address: string;
    customer_phone: string | null;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    whatsapp_sent: boolean;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    quantity: number;
    price: number;
    created_at: string;
}

export interface CreateOrderInput {
    customer_name: string;
    customer_address: string;
    customer_phone?: string;
    total_amount: number;
    notes?: string;
}

export interface CreateOrderItemInput {
    product_id?: string;
    product_name: string;
    quantity: number;
    price: number;
}

export type UserRole = 'admin' | 'staff';

export interface UserRoleRecord {
    id: string;
    user_id: string;
    role: UserRole;
    created_at: string;
}
