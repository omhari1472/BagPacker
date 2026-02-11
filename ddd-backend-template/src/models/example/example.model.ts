// Domain models for Example entity
export interface IExample {
	id: number;
	name: string;
	description?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ICreateExampleInput {
	name: string;
	description?: string;
}

export interface IUpdateExampleInput {
	name?: string;
	description?: string;
}

