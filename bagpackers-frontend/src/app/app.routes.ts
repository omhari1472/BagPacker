import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // Landing page - default route
  {
    path: '',
    loadComponent: () => import('./features/landing/components/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  
  // Authentication routes (guest only - redirects to dashboard if already logged in)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/components/signup/signup.component').then(m => m.SignupComponent),
    canActivate: [guestGuard]
  },
  
  // Booking routes (protected)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/booking/components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'booking/map',
    loadComponent: () => import('./features/booking/components/location-map/location-map.component').then(m => m.LocationMapComponent),
    canActivate: [authGuard]
  },
  
  // Payment routes (protected)
  {
    path: 'payment',
    loadComponent: () => import('./features/payment/components/payment-form/payment-form.component').then(m => m.PaymentFormComponent),
    canActivate: [authGuard]
  },
  
  // Partner routes (public)
  {
    path: 'partner',
    loadComponent: () => import('./features/partner/components/partner-landing/partner-landing.component').then(m => m.PartnerLandingComponent)
  },
  {
    path: 'partner/register',
    loadComponent: () => import('./features/partner/components/partner-form/partner-form.component').then(m => m.PartnerFormComponent)
  },
  
  // Wildcard route - redirect to landing page
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
