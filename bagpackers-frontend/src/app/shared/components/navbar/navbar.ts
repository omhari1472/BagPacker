import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { Observable } from 'rxjs';
import { CitySelectorComponent } from '../city-selector/city-selector';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, CitySelectorComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isAuthenticated: boolean = false;
  selectedCity: string = 'Delhi';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onCitySelected(city: string): void {
    this.selectedCity = city;
    // City change can be used for filtering or navigation if needed
  }

  navigateToPartner(): void {
    this.router.navigate(['/partner']);
  }

  logout(): void {
    this.authService.logout();
  }

  getUserDisplayName(user: User | null): string {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  }
}
