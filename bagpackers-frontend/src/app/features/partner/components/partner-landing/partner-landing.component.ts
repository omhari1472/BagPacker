import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface CarouselSlide {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-partner-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner-landing.component.html',
  styleUrls: ['./partner-landing.component.css']
})
export class PartnerLandingComponent implements OnInit {
  currentSlideIndex: number = 0;
  carouselSlides: CarouselSlide[] = [
    {
      image: '/images/investment.png',
      title: 'Earn Extra Income',
      description: 'Turn your unused space into a profitable storage solution. Earn money by helping travelers store their luggage safely.'
    },
    {
      image: '/images/security.png',
      title: 'Secure & Reliable',
      description: 'We provide insurance coverage and security guidelines to ensure safe storage. Your reputation and safety are our priority.'
    },
    {
      image: '/images/business.jpg',
      title: 'Flexible Business',
      description: 'Set your own availability and pricing. Work on your schedule and grow your storage business at your own pace.'
    }
  ];

  benefits = [
    {
      icon: '💰',
      title: 'Competitive Earnings',
      description: 'Earn ₹30 per bag per day with potential for higher rates in premium locations.'
    },
    {
      icon: '🛡️',
      title: 'Insurance Coverage',
      description: 'All stored items are covered by our comprehensive insurance policy.'
    },
    {
      icon: '📱',
      title: 'Easy Management',
      description: 'Manage bookings and availability through our simple partner dashboard.'
    },
    {
      icon: '🤝',
      title: 'Trusted Network',
      description: 'Join a growing network of verified partners across major cities in India.'
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

  navigateToRegistration(): void {
    this.router.navigate(['/partner/register']);
  }
}
