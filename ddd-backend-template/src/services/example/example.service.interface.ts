import type { IExample, ICreateExampleInput, IUpdateExampleInput } from '@models/example/example.model';

export interface IExampleService {
	createExample(input: ICreateExampleInput): Promise<IExample>;
	getExampleById(id: number): Promise<IExample>;
	getAllExamples(): Promise<IExample[]>;
	updateExample(id: number, input: IUpdateExampleInput): Promise<IExample>;
	deleteExample(id: number): Promise<void>;
}

