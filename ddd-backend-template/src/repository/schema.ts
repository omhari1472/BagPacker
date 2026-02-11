import { mysqlTable, varchar, int, timestamp } from 'drizzle-orm/mysql-core';

// Example schema - replace with your domain models
export const exampleTable = mysqlTable('examples', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }).notNull(),
	description: varchar('description', { length: 500 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Export all schema objects here
// Add more table schemas as needed

