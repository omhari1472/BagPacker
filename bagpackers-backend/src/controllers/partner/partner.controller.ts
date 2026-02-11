import { injectable, inject } from 'tsyringe';
import type { PartnerRepository, CreatePartnerData, Partner } from '@repository/partner/partner.repository';
import { TOKENS } from '@infrastructure/types';
import {
	PartnerValidationException,
	PartnerRegistrationException,
	InvalidMobileNumberException,
} from '@exceptions/partner.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

export interface RegisterPartnerRequest {
	fullName: string;
	region: string;
	mobileNumber: string;
	address: string;
}

export interface PartnerResponse {
	partner: Partner;
}

@injectable()
export class PartnerController {
	constructor(
		@inject(TOKENS.PARTNER_REPOSITORY) private partnerRepository: PartnerRepository
	) {}

	/**
	 * Register a new partner with validation
	 */
	async registerPartner(request: RegisterPartnerRequest): Promise<PartnerResponse> {
		try {
			// Validate required fields
			if (!request.fullName || !request.region || !request.mobileNumber || !request.address) {
				throw new BadRequestError('All fields are required: fullName, region, mobileNumber, address');
			}

			// Validate mobile number format
			// Accepts formats: +91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX (10 digits)
			const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
			if (!mobileRegex.test(request.mobileNumber.replace(/[\s-]/g, ''))) {
				throw new InvalidMobileNumberException('Mobile number must be a valid Indian mobile number (10 digits starting with 6-9)');
			}

			// Validate full name (should not be empty or just whitespace)
			if (request.fullName.trim().length === 0) {
				throw new PartnerValidationException('Full name cannot be empty');
			}

			// Validate region (should not be empty or just whitespace)
			if (request.region.trim().length === 0) {
				throw new PartnerValidationException('Region cannot be empty');
			}

			// Validate address (should not be empty or just whitespace)
			if (request.address.trim().length === 0) {
				throw new PartnerValidationException('Address cannot be empty');
			}

			// Create partner data
			const partnerData: CreatePartnerData = {
				fullName: request.fullName.trim(),
				region: request.region.trim(),
				mobileNumber: request.mobileNumber.replace(/[\s-]/g, ''), // Remove spaces and dashes
				address: request.address.trim(),
			};

			// Create partner record in repository
			const partner = await this.partnerRepository.createPartner(partnerData);

			return {
				partner,
			};
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof PartnerValidationException ||
				error instanceof InvalidMobileNumberException
			) {
				throw error;
			}
			throw new PartnerRegistrationException('Failed to register partner');
		}
	}
}
