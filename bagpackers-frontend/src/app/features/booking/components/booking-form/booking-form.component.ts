import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingApiService } from '../../services/booking-api.service';
import { CreateBookingRequest } from '../../../../core/models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  @Input() selectedCity: string = '';
  @Output() bookingCreated = new EventEmitter<any>();

  bookingForm: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  minDropOffDate: string;
  minPickupDate: string;

  constructor(
    private fb: FormBuilder,
    private bookingApiService: BookingApiService,
    private router: Router
  ) {
    const today = new Date();
    this.minDropOffDate = this.formatDate(today);
    this.minPickupDate = this.formatDate(today);

    this.bookingForm = this.fb.group({
      region: ['', [Validators.required]],
      numberOfBags: [1, [Validators.required, Validators.min(1)]],
      dropOffDate: ['', [Validators.required]],
      pickupDate: ['', [Validators.required]]
    }, { validators: this.dateValidator });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private dateValidator(group: FormGroup): { [key: string]: boolean } | null {
    const dropOffDate = group.get('dropOffDate')?.value;
    const pickupDate = group.get('pickupDate')?.value;

    if (!dropOffDate || !pickupDate) {
      return null;
    }

    const dropOff = new Date(dropOffDate);
    const pickup = new Date(pickupDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dropOff < today) {
      return { dropOffInPast: true };
    }

    if (pickup <= dropOff) {
      return { pickupBeforeDropOff: true };
    }

    return null;
  }

  onDropOffDateChange(): void {
    const dropOffDate = this.bookingForm.get('dropOffDate')?.value;
    if (dropOffDate) {
      const dropOff = new Date(dropOffDate);
      dropOff.setDate(dropOff.getDate() + 1);
      this.minPickupDate = this.formatDate(dropOff);
    }
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const bookingData: CreateBookingRequest = {
      ...this.bookingForm.value,
      city: this.selectedCity
    };

    this.bookingApiService.createBooking(bookingData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.isSubmitting.set(false);
          this.bookingCreated.emit(response.data);
          this.router.navigate(['/booking/map'], { 
            state: { booking: response.data } 
          });
        }
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error.error?.error?.message || 'Failed to create booking. Please try again.'
        );
      }
    });
  }

  get region() {
    return this.bookingForm.get('region');
  }

  get numberOfBags() {
    return this.bookingForm.get('numberOfBags');
  }

  get dropOffDate() {
    return this.bookingForm.get('dropOffDate');
  }

  get pickupDate() {
    return this.bookingForm.get('pickupDate');
  }

  get hasDateError(): boolean {
    return this.bookingForm.hasError('dropOffInPast') || 
           this.bookingForm.hasError('pickupBeforeDropOff');
  }

  get dateErrorMessage(): string {
    if (this.bookingForm.hasError('dropOffInPast')) {
      return 'Drop-off date cannot be in the past';
    }
    if (this.bookingForm.hasError('pickupBeforeDropOff')) {
      return 'Pickup date must be after drop-off date';
    }
    return '';
  }
}
