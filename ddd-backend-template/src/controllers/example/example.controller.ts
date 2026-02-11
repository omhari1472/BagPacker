import { CreateExampleError, FetchExampleError, UpdateExampleError, DeleteExampleError } from '@exceptions/example.exceptions';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { CREATE_EXAMPLE_ERROR, FETCH_EXAMPLE_ERROR, UPDATE_EXAMPLE_ERROR, DELETE_EXAMPLE_ERROR } from '@exceptions/errors';
import { createExampleInDb, fetchExampleByIdFromDb, fetchAllExamplesFromDb, updateExampleInDb, deleteExampleFromDb } from '@repository/example/example.repository';
import type { ICreateExampleSchema, IFetchExampleSchema, IUpdateExampleSchema, IDeleteExampleSchema } from '@routes/example/example.router';

export async function createExample(payload: ICreateExampleSchema) {
	try {
		return await createExampleInDb(payload);
	} catch (error) {
		if (error instanceof DBConnectionError) throw error;
		throw new CreateExampleError(CREATE_EXAMPLE_ERROR.message, CREATE_EXAMPLE_ERROR.errorCode, 500);
	}
}

export async function fetchExampleById(payload: IFetchExampleSchema) {
	try {
		return await fetchExampleByIdFromDb(payload.id);
	} catch (error) {
		if (error instanceof DBConnectionError) throw error;
		throw new FetchExampleError(FETCH_EXAMPLE_ERROR.message, FETCH_EXAMPLE_ERROR.errorCode, 500);
	}
}

export async function fetchAllExamples() {
	try {
		return await fetchAllExamplesFromDb();
	} catch (error) {
		if (error instanceof DBConnectionError) throw error;
		throw new FetchExampleError(FETCH_EXAMPLE_ERROR.message, FETCH_EXAMPLE_ERROR.errorCode, 500);
	}
}

export async function updateExample(payload: IUpdateExampleSchema) {
	try {
		return await updateExampleInDb(payload.id, payload);
	} catch (error) {
		if (error instanceof DBConnectionError) throw error;
		throw new UpdateExampleError(UPDATE_EXAMPLE_ERROR.message, UPDATE_EXAMPLE_ERROR.errorCode, 500);
	}
}

export async function deleteExample(payload: IDeleteExampleSchema) {
	try {
		await deleteExampleFromDb(payload.id);
		return { success: true };
	} catch (error) {
		if (error instanceof DBConnectionError) throw error;
		throw new DeleteExampleError(DELETE_EXAMPLE_ERROR.message, DELETE_EXAMPLE_ERROR.errorCode, 500);
	}
}

