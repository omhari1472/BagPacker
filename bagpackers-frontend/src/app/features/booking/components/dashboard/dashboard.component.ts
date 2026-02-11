import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { CitySelectorComponent } from '../../../../shared/components/city-selector/city-selector';

interface City {
  name: string;
  image: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BookingFormComponent, CitySelectorComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedCity = signal<string>('Delhi');
  cityImage = signal<string>('/images/cities/delhi.jpeg');

  cities: City[] = [
    { name: 'Delhi', image: '/images/cities/delhi.jpeg' },
    { name: 'Mumbai', image: '/images/cities/mumbai.jpeg' },
    { name: 'Kolkata', image: '/images/cities/Kolkata.jpeg' },
    { name: 'Chennai', image: '/images/cities/chennai.jpeg' },
    { name: 'Bangalore', image: '/images/cities/banglore.jpeg' },
    { name: 'Hyderabad', image: '/images/cities/hyderabad.jpeg' },
    { name: 'Pune', image: '/images/cities/pune.jpeg' },
    { name: 'Mysore', image: '/images/cities/mysore.jpeg' },
    { name: 'Jaipur', image: '/images/cities/jaipur.jpeg' }
  ];

  onCitySelected(cityName: string): void {
    const city = this.cities.find(c => c.name === cityName);
    
    if (city) {
      this.selectedCity.set(city.name);
      this.cityImage.set(city.image);
    }
  }

  onBookingCreated(booking: any): void {
    // Booking created successfully, navigation is handled by the form component
    console.log('Booking created:', booking);
  }
}
