import { DBConnectionError } from '@exceptions/core.exceptions';
import db from '@repository/repository';
import { eq } from 'drizzle-orm';
import { exampleTable } from '@repository/schema';

export async function createExampleInDb(data: { name: string; description?: string }) {
	try {
		// TODO: Implement actual database insertion
		// const result = await db.insert(exampleTable).values(data);
		// return result;
		return { id: 1, ...data };
	} catch (error) {
		throw new DBConnectionError('Failed to create example in database');
	}
}

export async function fetchExampleByIdFromDb(id: number) {
	try {
		// TODO: Implement actual database query
		// const result = await db.select().from(exampleTable).where(eq(exampleTable.id, id));
		// return result[0];
		return { id, name: 'Example', description: 'Example description' };
	} catch (error) {
		throw new DBConnectionError('Failed to fetch example from database');
	}
}

export async function fetchAllExamplesFromDb() {
	try {
		// TODO: Implement actual database query
		// return await db.select().from(exampleTable);
		return [];
	} catch (error) {
		throw new DBConnectionError('Failed to fetch examples from database');
	}
}

export async function updateExampleInDb(id: number, data: { name?: string; description?: string }) {
	try {
		// TODO: Implement actual database update
		// const result = await db.update(exampleTable).set(data).where(eq(exampleTable.id, id));
		// return result;
		return { id, ...data };
	} catch (error) {
		throw new DBConnectionError('Failed to update example in database');
	}
}

export async function deleteExampleFromDb(id: number) {
	try {
		// TODO: Implement actual database deletion
		// const result = await db.delete(exampleTable).where(eq(exampleTable.id, id));
		// return result;
		return { success: true };
	} catch (error) {
		throw new DBConnectionError('Failed to delete example from database');
	}
}

