import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BookingApiService } from '../../services/booking-api.service';
import { Booking, PartnerLocation } from '../../../../core/models/booking.model';

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent implements OnInit {
  booking = signal<Booking | null>(null);
  locations = signal<PartnerLocation[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  mapUrl: SafeResourceUrl | null = null;

  constructor(
    private router: Router,
    private bookingApiService: BookingApiService,
    private sanitizer: DomSanitizer
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
    
    if (state && state['booking']) {
      this.booking.set(state['booking']);
    }
  }

  ngOnInit(): void {
    const currentBooking = this.booking();
    
    if (!currentBooking) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadLocations(currentBooking.region, currentBooking.city);
    this.generateMapUrl(currentBooking.region, currentBooking.city);
  }

  private loadLocations(region: string, city: string): void {
    this.bookingApiService.getLocations(region, city).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.data) {
          this.locations.set(response.data);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.error?.message || 'Failed to load locations'
        );
      }
    });
  }

  private generateMapUrl(region: string, city: string): void {
    // Generate Google Maps embed URL with the region and city
    const query = encodeURIComponent(`${region}, ${city}`);
    const url = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${query}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goToPayment(): void {
    const currentBooking = this.booking();
    if (currentBooking) {
      this.router.navigate(['/payment'], {
        state: { booking: currentBooking }
      });
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  get totalCost(): number {
    const currentBooking = this.booking();
    return currentBooking ? currentBooking.totalCost : 0;
  }

  get numberOfBags(): number {
    const currentBooking = this.booking();
    return currentBooking ? currentBooking.numberOfBags : 0;
  }

  get region(): string {
    const currentBooking = this.booking();
    return currentBooking ? currentBooking.region : '';
  }

  get city(): string {
    const currentBooking = this.booking();
    return currentBooking ? currentBooking.city : '';
  }
}
