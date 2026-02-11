import { createExample, fetchExampleById, fetchAllExamples, updateExample, deleteExample } from '@controllers/example/example.controller';
import { CreateExampleError, FetchExampleError, UpdateExampleError, DeleteExampleError } from '@exceptions/example.exceptions';
import { BadRequestError, DBConnectionError } from '@exceptions/core.exceptions';
import { withAuth } from '@middlewares/auth.middleware';
import { getErrorApiResponse, getSuccessApiResponse } from '@utils/Response.utils';
import { fromIttyRouter } from 'chanfana';
import type { IAuthRequest } from 'infrastructure/core.model';
import { CustomOpenAPIRoute } from 'infrastructure/customAPIRoute';
import { Router } from 'itty-router';
import { z } from 'zod';

const router = Router({
	base: '/example',
});
const exampleRouter = fromIttyRouter(router, {
	base: '/example',
});
export default exampleRouter;

// @type    POST
// @route   /example/create
// @desc    Create an example
const CreateExampleSchema = z.object({
	name: z.string().min(1).describe('Example name'),
	description: z.string().optional().describe('Example description'),
});
export type ICreateExampleSchema = z.infer<typeof CreateExampleSchema>;
export class CreateExample extends CustomOpenAPIRoute {
	schema = {
		tags: ['Examples'],
		summary: 'Create an example',
		request: {
			body: {
				content: {
					'application/json': {
						schema: CreateExampleSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'Success Response',
				schema: {
					status: 'success',
					statusCode: 200,
					data: { id: 1, name: 'Example', description: 'Example description' },
					error: null,
					message: 'Operation Successful',
				},
			},
		},
	};

	async handle(request: IAuthRequest, env: any, context: ExecutionContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		try {
			const payload = data.body;
			const response = await createExample(payload);
			return getSuccessApiResponse(response);
		} catch (error) {
			if (error instanceof BadRequestError || error instanceof DBConnectionError || error instanceof CreateExampleError) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error);
		}
	}
}
exampleRouter.post('/create', withAuth, CreateExample);

// @type    GET
// @route   /example/:id
// @desc    Get example by id
const FetchExampleSchema = z.object({
	id: z.coerce.number().describe('Example ID'),
});
export type IFetchExampleSchema = z.infer<typeof FetchExampleSchema>;
export class FetchExample extends CustomOpenAPIRoute {
	schema = {
		tags: ['Examples'],
		summary: 'Fetch an example by ID',
		request: {
			params: {
				content: {
					'application/json': {
						schema: FetchExampleSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'Success Response',
				schema: {
					status: 'success',
					statusCode: 200,
					data: { id: 1, name: 'Example', description: 'Example description' },
					error: null,
					message: 'Operation Successful',
				},
			},
		},
	};

	async handle(request: IAuthRequest, env: any, context: ExecutionContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		try {
			const payload = { id: Number(request.params?.id) };
			const response = await fetchExampleById(payload);
			return getSuccessApiResponse(response);
		} catch (error) {
			if (error instanceof BadRequestError || error instanceof DBConnectionError || error instanceof FetchExampleError) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error);
		}
	}
}
exampleRouter.get('/:id', withAuth, FetchExample);

// @type    GET
// @route   /example
// @desc    Get all examples
export class FetchAllExamples extends CustomOpenAPIRoute {
	schema = {
		tags: ['Examples'],
		summary: 'Fetch all examples',
		responses: {
			'200': {
				description: 'Success Response',
				schema: {
					status: 'success',
					statusCode: 200,
					data: [],
					error: null,
					message: 'Operation Successful',
				},
			},
		},
	};

	async handle(request: IAuthRequest, env: any, context: ExecutionContext) {
		try {
			const response = await fetchAllExamples();
			return getSuccessApiResponse(response);
		} catch (error) {
			if (error instanceof BadRequestError || error instanceof DBConnectionError || error instanceof FetchExampleError) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error);
		}
	}
}
exampleRouter.get('/', withAuth, FetchAllExamples);

// @type    PATCH
// @route   /example/update
// @desc    Update an example
const UpdateExampleSchema = z.object({
	id: z.number().describe('Example ID'),
	name: z.string().min(1).optional().describe('Example name'),
	description: z.string().optional().describe('Example description'),
});
export type IUpdateExampleSchema = z.infer<typeof UpdateExampleSchema>;
export class UpdateExample extends CustomOpenAPIRoute {
	schema = {
		tags: ['Examples'],
		summary: 'Update an example',
		request: {
			body: {
				content: {
					'application/json': {
						schema: UpdateExampleSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'Success Response',
				schema: {
					status: 'success',
					statusCode: 200,
					data: { id: 1, name: 'Updated Example', description: 'Updated description' },
					error: null,
					message: 'Operation Successful',
				},
			},
		},
	};

	async handle(request: IAuthRequest, env: any, context: ExecutionContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		try {
			const payload = data.body;
			const response = await updateExample(payload);
			return getSuccessApiResponse(response);
		} catch (error) {
			if (error instanceof BadRequestError || error instanceof DBConnectionError || error instanceof UpdateExampleError) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error);
		}
	}
}
exampleRouter.patch('/update', withAuth, UpdateExample);

// @type    DELETE
// @route   /example/:id
// @desc    Delete an example
const DeleteExampleSchema = z.object({
	id: z.number().describe('Example ID'),
});
export type IDeleteExampleSchema = z.infer<typeof DeleteExampleSchema>;
export class DeleteExample extends CustomOpenAPIRoute {
	schema = {
		tags: ['Examples'],
		summary: 'Delete an example',
		request: {
			params: {
				content: {
					'application/json': {
						schema: DeleteExampleSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'Success Response',
				schema: {
					status: 'success',
					statusCode: 200,
					data: { success: true },
					error: null,
					message: 'Operation Successful',
				},
			},
		},
	};

	async handle(request: IAuthRequest, env: any, context: ExecutionContext) {
		try {
			const payload = { id: Number(request.params?.id) };
			const response = await deleteExample(payload);
			return getSuccessApiResponse(response);
		} catch (error) {
			if (error instanceof BadRequestError || error instanceof DBConnectionError || error instanceof DeleteExampleError) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error);
		}
	}
}
exampleRouter.delete('/:id', withAuth, DeleteExample);

