import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Lazy-loaded database connection
let dbInstance: PostgresJsDatabase<typeof schema> | null = null;

function getDb(): PostgresJsDatabase<typeof schema> {
    if (!dbInstance) {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable is not set');
        }

        const client = postgres(connectionString, { prepare: false });
        dbInstance = drizzle(client, { schema });
    }
    return dbInstance;
}

// Export as a getter that lazily initializes
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
    get(_, prop) {
        const instance = getDb();
        const value = instance[prop as keyof typeof instance];
        if (typeof value === 'function') {
            return value.bind(instance);
        }
        return value;
    },
});

// Re-export schema for convenience
export * from './schema';

