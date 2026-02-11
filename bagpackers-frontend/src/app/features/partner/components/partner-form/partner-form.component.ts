import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PartnerApiService } from '../../services/partner-api.service';

@Component({
  selector: 'app-partner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partner-form.component.html',
  styleUrls: ['./partner-form.component.css']
})
export class PartnerFormComponent implements OnInit {
  partnerForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  cities = [
    'Delhi',
    'Mumbai',
    'Kolkata',
    'Chennai',
    'Bangalore',
    'Hyderabad',
    'Pune',
    'Mysore',
    'Jaipur'
  ];

  constructor(
    private fb: FormBuilder,
    private partnerApiService: PartnerApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.partnerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      region: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.partnerForm.invalid) {
      this.markFormGroupTouched(this.partnerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.partnerApiService.registerPartner(this.partnerForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Registration successful! Our team will contact you within 24-48 hours for verification.';
          this.partnerForm.reset();
          
          // Navigate back to partner landing after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/partner']);
          }, 3000);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/partner']);
  }

  get fullName() {
    return this.partnerForm.get('fullName');
  }

  get region() {
    return this.partnerForm.get('region');
  }

  get mobileNumber() {
    return this.partnerForm.get('mobileNumber');
  }

  get address() {
    return this.partnerForm.get('address');
  }
}
