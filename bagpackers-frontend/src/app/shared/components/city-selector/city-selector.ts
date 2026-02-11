import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface City {
  name: string;
  image?: string;
}

@Component({
  selector: 'app-city-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './city-selector.html',
  styleUrl: './city-selector.css'
})
export class CitySelectorComponent {
  @Input() selectedCity: string = 'Delhi';
  @Output() citySelected = new EventEmitter<string>();

  cities: City[] = [
    { name: 'Delhi', image: '/assets/images/cities/delhi.jpeg' },
    { name: 'Mumbai', image: '/assets/images/cities/mumbai.jpeg' },
    { name: 'Kolkata', image: '/assets/images/cities/Kolkata.jpeg' },
    { name: 'Chennai', image: '/assets/images/cities/chennai.jpeg' },
    { name: 'Bangalore', image: '/assets/images/cities/banglore.jpeg' },
    { name: 'Hyderabad', image: '/assets/images/cities/hyderabad.jpeg' },
    { name: 'Pune', image: '/assets/images/cities/pune.jpeg' },
    { name: 'Mysore', image: '/assets/images/cities/mysore.jpeg' },
    { name: 'Jaipur', image: '/assets/images/cities/jaipur.jpeg' }
  ];

  onCityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const city = target.value;
    this.selectedCity = city;
    this.citySelected.emit(city);
  }

  getCityNames(): string[] {
    return this.cities.map(city => city.name);
  }
}
