import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface CarouselSlide {
  image: string;
  title: string;
  description: string;
}

interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  currentSlideIndex: number = 0;
  
  carouselSlides: CarouselSlide[] = [
    {
      image: '/images/carousel.jpg',
      title: 'Store Your Luggage Safely',
      description: 'Travel light and explore freely. Find secure luggage storage locations across major cities in India.'
    },
    {
      image: '/images/carousel-2.jpg',
      title: 'Convenient Locations',
      description: 'Access storage facilities near railway stations, airports, and tourist attractions. Book in minutes.'
    },
    {
      image: '/images/carousel-3.jpg',
      title: 'Affordable & Secure',
      description: 'Starting at just ₹30 per bag per day. All items are insured and stored in verified locations.'
    }
  ];

  serviceFeatures: ServiceFeature[] = [
    {
      icon: '🔒',
      title: 'Secure Storage',
      description: 'All storage locations are verified and monitored. Your belongings are safe with us.'
    },
    {
      icon: '📍',
      title: 'Prime Locations',
      description: 'Find storage near major transit hubs and tourist spots in Delhi, Mumbai, Bangalore, and more.'
    },
    {
      icon: '💰',
      title: 'Affordable Pricing',
      description: 'Pay only ₹30 per bag per day. No hidden charges, transparent pricing.'
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Book your storage space in minutes. Quick drop-off and pickup process.'
    },
    {
      icon: '🛡️',
      title: 'Insurance Coverage',
      description: 'All stored items are covered by comprehensive insurance for your peace of mind.'
    },
    {
      icon: '📱',
      title: 'Easy Management',
      description: 'Track your bookings, extend storage time, and manage everything from your dashboard.'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCarousel();
  }

  startCarousel(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.carouselSlides.length;
  }

  previousSlide(): void {
    this.currentSlideIndex = this.currentSlideIndex === 0 
      ? this.carouselSlides.length - 1 
      : this.currentSlideIndex - 1;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToPartner(): void {
    this.router.navigate(['/partner']);
  }
}
