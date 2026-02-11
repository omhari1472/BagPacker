import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/repository/schema.ts',
	dialect: 'mysql',
	verbose: true,
	strict: true,
});

