import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { BaseRepository } from '../repository';
import { partners } from '../schema';

export interface CreatePartnerData {
	fullName: string;
	region: string;
	mobileNumber: string;
	address: string;
}

export interface Partner {
	id: number;
	fullName: string;
	region: string;
	mobileNumber: string;
	address: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}

@injectable()
export class PartnerRepository extends BaseRepository {
	/**
	 * Create a new partner registration
	 */
	async createPartner(data: CreatePartnerData): Promise<Partner> {
		const result = await this.db.insert(partners).values({
			fullName: data.fullName,
			region: data.region,
			mobileNumber: data.mobileNumber,
			address: data.address,
			status: 'pending',
		});

		const insertId = Number(result[0].insertId);
		const partner = await this.findPartnerById(insertId);

		if (!partner) {
			throw new Error('Failed to create partner');
		}

		return partner;
	}

	/**
	 * Find all partners in a specific region
	 */
	async findPartnersByRegion(region: string): Promise<Partner[]> {
		const result = await this.db
			.select()
			.from(partners)
			.where(eq(partners.region, region));

		return result.map(row => this.mapToPartner(row));
	}

	/**
	 * Find a partner by ID
	 */
	async findPartnerById(id: number): Promise<Partner | null> {
		const result = await this.db
			.select()
			.from(partners)
			.where(eq(partners.id, id))
			.limit(1);

		return result[0] ? this.mapToPartner(result[0]) : null;
	}

	/**
	 * Map database result to Partner interface
	 */
	private mapToPartner(row: any): Partner {
		return {
			id: row.id,
			fullName: row.fullName,
			region: row.region,
			mobileNumber: row.mobileNumber,
			address: row.address,
			status: row.status || 'pending',
			createdAt: row.createdAt!,
			updatedAt: row.updatedAt!,
		};
	}
}
