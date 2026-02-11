import { drizzle } from 'drizzle-orm/mysql2';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import * as schema from './schema';

// Type for the database instance
export type Database = MySql2Database<typeof schema>;

// Database connection setup for MySQL
// This will be initialized with environment variables from Cloudflare Workers
let dbInstance: Database | null = null;
let connectionPool: Pool | null = null;

/**
 * Initialize the database connection with the provided connection string
 * @param databaseUrl - MySQL connection string (e.g., mysql://user:password@host:port/database)
 * @returns Drizzle database instance
 */
export function initializeDatabase(databaseUrl: string): Database {
	if (!databaseUrl) {
		throw new Error('DATABASE_URL is required to initialize the database connection');
	}

	// Create connection pool for better performance
	connectionPool = mysql.createPool({
		uri: databaseUrl,
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
		enableKeepAlive: true,
		keepAliveInitialDelay: 0,
	});

	// Initialize Drizzle ORM with the connection pool
	dbInstance = drizzle(connectionPool, { schema, mode: 'default' });
	
	return dbInstance;
}

/**
 * Get the database instance
 * @throws Error if database is not initialized
 * @returns Drizzle database instance
 */
export function getDatabase(): Database {
	if (!dbInstance) {
		throw new Error('Database not initialized. Call initializeDatabase first.');
	}
	return dbInstance;
}

/**
 * Close the database connection pool
 * Useful for cleanup in tests or graceful shutdown
 */
export async function closeDatabase(): Promise<void> {
	if (connectionPool) {
		await connectionPool.end();
		connectionPool = null;
		dbInstance = null;
	}
}

/**
 * Check if database is initialized
 * @returns true if database is initialized, false otherwise
 */
export function isDatabaseInitialized(): boolean {
	return dbInstance !== null;
}

/**
 * Base repository class for common operations
 * All domain repositories should extend this class
 */
export abstract class BaseRepository {
	/**
	 * Get the database instance
	 * @throws Error if database is not initialized
	 */
	protected get db(): Database {
		return getDatabase();
	}

	/**
	 * Execute a transaction
	 * @param callback - Transaction callback function
	 * @returns Result of the transaction
	 */
	protected async transaction<T>(
		callback: (tx: Database) => Promise<T>
	): Promise<T> {
		const db = this.db;
		return await db.transaction(callback);
	}
}
