export interface Booking {
  id: number;
  userId: number;
  region: string;
  city: string;
  numberOfBags: number;
  dropOffDate: string;
  pickupDate: string;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface CreateBookingRequest {
  region: string;
  city: string;
  numberOfBags: number;
  dropOffDate: string;
  pickupDate: string;
}

export interface PartnerLocation {
  id: number;
  partnerId: number;
  region: string;
  city: string;
  latitude?: number;
  longitude?: number;
  availableSpaces: number;
  pricePerBag: number;
}
