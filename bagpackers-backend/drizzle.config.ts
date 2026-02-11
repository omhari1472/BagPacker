import { defineConfig } from 'drizzle-kit';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .dev.vars file
function loadDevVars() {
	const devVarsPath = path.join(__dirname, '.dev.vars');
	if (fs.existsSync(devVarsPath)) {
		const content = fs.readFileSync(devVarsPath, 'utf-8');
		const lines = content.split('\n');
		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed && !trimmed.startsWith('#')) {
				const [key, ...valueParts] = trimmed.split('=');
				if (key && valueParts.length > 0) {
					const value = valueParts.join('=');
					process.env[key] = value;
				}
			}
		}
	}
}

// Load .dev.vars if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
	loadDevVars();
}

export default defineConfig({
	schema: './src/repository/schema.ts',
	out: './drizzle',
	dialect: 'mysql',
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
	},
	verbose: true,
	strict: true,
});
