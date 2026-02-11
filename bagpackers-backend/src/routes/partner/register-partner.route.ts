import { fromIttyRouter } from 'chanfana';
import { Router } from 'itty-router';
import { z } from 'zod';
import { CustomOpenAPIRoute } from '@infrastructure/customAPIRoute';
import type { IAuthRequest } from '@infrastructure/core.model';
import { container } from '@infrastructure/di/container';
import { PartnerController } from '@controllers/partner/partner.controller';
import { TOKENS } from '@infrastructure/types';
import { getSuccessApiResponse, getErrorApiResponse } from '@utils/Response.utils';
import {
	PartnerValidationException,
	PartnerRegistrationException,
	InvalidMobileNumberException,
} from '@exceptions/partner.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

const router = Router({
	base: '/partners',
});

export const registerPartnerRouter = fromIttyRouter(router, {
	base: '/partners',
});

// Register Partner Schema
const RegisterPartnerSchema = z.object({
	fullName: z.string().min(1).describe('Partner full name'),
	region: z.string().min(1).describe('Region where partner will provide storage'),
	mobileNumber: z.string().min(10).describe('Partner mobile number (10 digits)'),
	address: z.string().min(1).describe('Partner full address'),
});

export type IRegisterPartnerSchema = z.infer<typeof RegisterPartnerSchema>;

/**
 * @route   POST /partners/register
 * @desc    Register a new partner for luggage storage
 * @access  Public
 */
export class RegisterPartner extends CustomOpenAPIRoute {
	schema = {
		tags: ['Partners'],
		summary: 'Register a new partner',
		description: 'Register as a luggage storage partner to provide storage space',
		request: {
			body: {
				content: {
					'application/json': {
						schema: RegisterPartnerSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'Partner registered successfully',
				content: {
					'application/json': {
						schema: {
							status: 'success',
							statusCode: 200,
							data: {
								partner: {
									id: 1,
									fullName: 'John Doe',
									region: 'Connaught Place, Delhi',
									mobileNumber: '9876543210',
									address: '123 Main Street, Delhi',
									status: 'pending',
									createdAt: '2024-01-01T00:00:00.000Z',
								},
							},
							error: null,
							message: 'Partner registered successfully',
						},
					},
				},
			},
			'400': {
				description: 'Bad request - validation error',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 400,
							data: null,
							error: {
								message: 'Invalid mobile number format',
								errorCode: 'INVALID_MOBILE_NUMBER',
							},
							message: 'Invalid mobile number format',
						},
					},
				},
			},
			'500': {
				description: 'Internal server error',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 500,
							data: null,
							error: {
								message: 'Failed to register partner',
								errorCode: 'PARTNER_REGISTRATION_ERROR',
							},
							message: 'Failed to register partner',
						},
					},
				},
			},
		},
	};

	async handle(request: IAuthRequest, env: any, context: ExecutionContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		try {
			const payload = data.body;

			// Get PartnerController from DI container
			const partnerController = new PartnerController(
				container.resolve(TOKENS.PARTNER_REPOSITORY)
			);

			const response = await partnerController.registerPartner(payload);
			return getSuccessApiResponse(response, 'Partner registered successfully');
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof PartnerValidationException ||
				error instanceof InvalidMobileNumberException ||
				error instanceof PartnerRegistrationException
			) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error as Error);
		}
	}
}

registerPartnerRouter.post('/register', RegisterPartner);
