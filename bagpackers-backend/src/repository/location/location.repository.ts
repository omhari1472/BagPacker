import { eq, and } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { BaseRepository } from '../repository';
import { partnerLocations } from '../schema';

export interface PartnerLocation {
	id: number;
	partnerId: number;
	region: string;
	city: string;
	latitude: string | null;
	longitude: string | null;
	availableSpaces: number;
	pricePerBag: string;
	createdAt: Date;
	updatedAt: Date;
}

@injectable()
export class LocationRepository extends BaseRepository {
	/**
	 * Find partner locations by region and optionally by city
	 * Used for map display to show available storage locations
	 */
	async findLocationsByRegion(region: string, city?: string): Promise<PartnerLocation[]> {
		const conditions = city 
			? and(eq(partnerLocations.region, region), eq(partnerLocations.city, city))
			: eq(partnerLocations.region, region);

		const result = await this.db
			.select()
			.from(partnerLocations)
			.where(conditions);

		return result.map(row => this.mapToPartnerLocation(row));
	}

	/**
	 * Map database result to PartnerLocation interface
	 */
	private mapToPartnerLocation(row: any): PartnerLocation {
		return {
			id: row.id,
			partnerId: row.partnerId,
			region: row.region,
			city: row.city,
			latitude: row.latitude,
			longitude: row.longitude,
			availableSpaces: row.availableSpaces || 0,
			pricePerBag: row.pricePerBag || '30.00',
			createdAt: row.createdAt!,
			updatedAt: row.updatedAt!,
		};
	}
}
