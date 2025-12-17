import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For server-side usage only
const connectionString = process.env.DATABASE_URL!;

// Create postgres connection
const client = postgres(connectionString, { prepare: false });

// Create drizzle instance with schema
export const db = drizzle(client, { schema });

// Re-export schema for convenience
export * from './schema';
