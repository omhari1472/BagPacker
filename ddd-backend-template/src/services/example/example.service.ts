import type { IExampleService } from '@services/example/example.service.interface';
import type { IExample, ICreateExampleInput, IUpdateExampleInput } from '@models/example/example.model';
import { createExampleInDb, fetchExampleByIdFromDb, fetchAllExamplesFromDb, updateExampleInDb, deleteExampleFromDb } from '@repository/example/example.repository';

// Service interface
export interface IExampleService {
	createExample(input: ICreateExampleInput): Promise<IExample>;
	getExampleById(id: number): Promise<IExample>;
	getAllExamples(): Promise<IExample[]>;
	updateExample(id: number, input: IUpdateExampleInput): Promise<IExample>;
	deleteExample(id: number): Promise<void>;
}

// Service implementation
export class ExampleService implements IExampleService {
	async createExample(input: ICreateExampleInput): Promise<IExample> {
		return await createExampleInDb(input);
	}

	async getExampleById(id: number): Promise<IExample> {
		return await fetchExampleByIdFromDb(id);
	}

	async getAllExamples(): Promise<IExample[]> {
		return await fetchAllExamplesFromDb();
	}

	async updateExample(id: number, input: IUpdateExampleInput): Promise<IExample> {
		return await updateExampleInDb(id, input);
	}

	async deleteExample(id: number): Promise<void> {
		await deleteExampleFromDb(id);
	}
}

