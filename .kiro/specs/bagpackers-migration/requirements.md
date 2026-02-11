# Requirements Document

## Introduction

This document outlines the requirements for migrating the BagPackers luggage storage application from a PHP monolithic architecture to a modern stack using Angular for the frontend and Cloudflare Workers for the backend. The project will be organized into two separate folders: `bagpackers-frontend` for the Angular application and `bagpackers-backend` for the Cloudflare Workers API. The backend will follow a Domain-Driven Design (DDD) architecture with a modified flow: router → controller → repository, where controllers handle business logic and repositories handle data access. The services folder will be reserved exclusively for external service integrations (payment gateways, OAuth providers, etc.).

## Glossary

- **BagPackers_System**: The complete luggage storage platform including frontend and backend
- **Angular_Frontend**: The client-side single-page application built with Angular, located in the bagpackers-frontend folder
- **Cloudflare_Backend**: The serverless backend API running on Cloudflare Workers, located in the bagpackers-backend folder
- **User**: A customer who wants to store luggage
- **Partner**: A host who provides luggage storage space
- **Booking**: A reservation for luggage storage with dates and location
- **Payment_Service**: External Razorpay payment gateway integration
- **OAuth_Service**: External Google OAuth authentication provider
- **Repository**: Data access layer that interacts with the database
- **Controller**: Business logic layer that processes requests and orchestrates data operations
- **JWT_Token**: JSON Web Token used for authentication

## Requirements

### Requirement 1: User Authentication and Registration

**User Story:** As a User, I want to register and login to the platform, so that I can access luggage storage services

#### Acceptance Criteria

1. WHEN a User submits valid registration data (firstName, lastName, email, password), THE Cloudflare_Backend SHALL create a new user account and return a JWT_Token
2. WHEN a User submits valid login credentials (email, password), THE Cloudflare_Backend SHALL authenticate the user and return a JWT_Token
3. WHEN a User initiates Google OAuth login, THE OAuth_Service SHALL authenticate the user and THE Cloudflare_Backend SHALL create or retrieve the user account
4. THE Cloudflare_Backend SHALL validate that email addresses follow proper format before account creation
5. THE Cloudflare_Backend SHALL validate that passwords are at least 6 characters long before account creation
6. WHEN a User provides mismatched password and confirmPassword fields, THE Angular_Frontend SHALL display a validation error
7. THE Angular_Frontend SHALL store the JWT_Token securely in browser storage after successful authentication
8. WHEN a JWT_Token expires, THE Cloudflare_Backend SHALL return an authentication error with status code 401

### Requirement 2: City and Region Selection

**User Story:** As a User, I want to browse and select cities for luggage storage, so that I can find storage locations near my destination

#### Acceptance Criteria

1. THE Angular_Frontend SHALL display a navigation menu with top cities (Delhi, Mumbai, Kolkata, Chennai, Bangalore, Hyderabad, Pune, Mysore, Jaipur)
2. WHEN a User selects a city from the dropdown, THE Angular_Frontend SHALL update the display with the selected city name and corresponding image
3. THE Cloudflare_Backend SHALL provide an API endpoint that returns available cities with their metadata
4. THE Angular_Frontend SHALL allow users to enter a specific region within the selected city
5. WHEN a User enters a region, THE Angular_Frontend SHALL validate that the region field is not empty before submission

### Requirement 3: Luggage Storage Booking

**User Story:** As a User, I want to create a booking for luggage storage, so that I can reserve space for my bags

#### Acceptance Criteria

1. WHEN a User submits booking details (region, number of bags, drop-off date, pickup date), THE Cloudflare_Backend SHALL create a booking record
2. THE Cloudflare_Backend SHALL validate that drop-off date is not in the past
3. THE Cloudflare_Backend SHALL validate that pickup date is after drop-off date
4. THE Cloudflare_Backend SHALL validate that number of bags is a positive integer
5. WHEN a booking is created, THE Cloudflare_Backend SHALL calculate the total cost based on number of bags multiplied by 30 currency units per bag
6. THE Cloudflare_Backend SHALL associate each booking with the authenticated User via JWT_Token
7. THE Angular_Frontend SHALL display all required fields (region, bags, drop-off, pickup) with proper validation messages

### Requirement 4: Payment Processing

**User Story:** As a User, I want to complete payment for my booking, so that I can confirm my luggage storage reservation

#### Acceptance Criteria

1. WHEN a User initiates payment, THE Angular_Frontend SHALL display the booking details (region, number of bags, total cost)
2. WHEN a User clicks the payment button, THE Payment_Service SHALL open the Razorpay payment gateway with booking amount
3. THE Cloudflare_Backend SHALL create a payment order via the Payment_Service before displaying the payment interface
4. WHEN payment is successful, THE Payment_Service SHALL send a callback and THE Cloudflare_Backend SHALL update the booking status to confirmed
5. THE Cloudflare_Backend SHALL store payment transaction details (transaction ID, amount, status, timestamp)
6. WHEN payment fails, THE Angular_Frontend SHALL display an error message and allow the user to retry
7. THE Angular_Frontend SHALL collect user payment details (full name, email, mobile number, address) before initiating payment

### Requirement 5: Storage Location Map Display

**User Story:** As a User, I want to view available storage locations on a map, so that I can see where I can drop off my luggage

#### Acceptance Criteria

1. WHEN a User completes a booking search, THE Angular_Frontend SHALL display an embedded map showing storage locations
2. THE Cloudflare_Backend SHALL provide an API endpoint that returns partner locations based on the selected region
3. THE Angular_Frontend SHALL display booking summary (region, number of bags, total cost) alongside the map
4. THE Angular_Frontend SHALL provide a navigation option to return to the dashboard from the map view
5. WHEN no storage locations are available in the selected region, THE Angular_Frontend SHALL display an appropriate message

### Requirement 6: Partner Registration

**User Story:** As a Partner, I want to register as a luggage storage host, so that I can earn money by providing storage space

#### Acceptance Criteria

1. WHEN a Partner submits the contact form (full name, region, mobile number, address), THE Cloudflare_Backend SHALL create a partner registration request
2. THE Cloudflare_Backend SHALL validate that mobile number follows a valid format
3. THE Cloudflare_Backend SHALL validate that all required fields (full name, region, mobile number, address) are provided
4. THE Angular_Frontend SHALL display a carousel showcasing partner benefits
5. THE Angular_Frontend SHALL display informational content about becoming a partner
6. WHEN partner registration is successful, THE Angular_Frontend SHALL display a confirmation message

### Requirement 7: Backend Architecture Implementation

**User Story:** As a Developer, I want the backend to follow DDD principles with the modified architecture, so that the codebase is maintainable and scalable

#### Acceptance Criteria

1. THE Cloudflare_Backend SHALL implement a router layer that defines API endpoints with OpenAPI documentation
2. THE Cloudflare_Backend SHALL implement controllers that contain business logic for each domain feature
3. THE Cloudflare_Backend SHALL implement repositories that handle all database operations using Drizzle ORM
4. THE Cloudflare_Backend SHALL implement services only for external integrations (Payment_Service, OAuth_Service)
5. THE Cloudflare_Backend SHALL use dependency injection via TSyringe for loose coupling
6. THE Cloudflare_Backend SHALL validate all incoming requests using Zod schemas
7. THE Cloudflare_Backend SHALL implement custom exception classes for proper error handling
8. THE Cloudflare_Backend SHALL use JWT-based authentication middleware for protected routes

### Requirement 8: Frontend Architecture Implementation

**User Story:** As a Developer, I want the frontend to follow Angular best practices, so that the application is performant and maintainable

#### Acceptance Criteria

1. THE Angular_Frontend SHALL implement a modular architecture with feature modules (auth, booking, partner)
2. THE Angular_Frontend SHALL implement services for API communication with the Cloudflare_Backend
3. THE Angular_Frontend SHALL implement route guards for protected pages requiring authentication
4. THE Angular_Frontend SHALL implement reactive forms with validation for all user inputs
5. THE Angular_Frontend SHALL implement a shared module for reusable components (navbar, buttons, forms)
6. THE Angular_Frontend SHALL implement interceptors for adding JWT_Token to API requests
7. THE Angular_Frontend SHALL implement error handling for API failures with user-friendly messages
8. THE Angular_Frontend SHALL be responsive and work on mobile, tablet, and desktop devices

### Requirement 9: Data Migration

**User Story:** As a Developer, I want to migrate existing data from MySQL to the new database, so that existing users and bookings are preserved

#### Acceptance Criteria

1. THE Cloudflare_Backend SHALL define database schemas using Drizzle ORM for users, bookings, payments, and partners
2. WHERE existing data exists in the PHP MySQL database, THE migration process SHALL transfer user accounts to the new database
3. WHERE existing data exists in the PHP MySQL database, THE migration process SHALL transfer booking records to the new database
4. THE Cloudflare_Backend SHALL ensure that migrated passwords are properly hashed using secure algorithms
5. THE migration process SHALL validate data integrity after transfer

### Requirement 10: Project Structure Organization

**User Story:** As a Developer, I want the project organized into separate frontend and backend folders, so that each can be developed, deployed, and maintained independently

#### Acceptance Criteria

1. THE BagPackers_System SHALL organize the codebase into two root-level folders: bagpackers-frontend and bagpackers-backend
2. THE bagpackers-frontend folder SHALL contain the complete Angular application with its own package.json and dependencies
3. THE bagpackers-backend folder SHALL contain the complete Cloudflare Workers application with its own package.json and dependencies
4. THE bagpackers-frontend folder SHALL have its own build and deployment configuration
5. THE bagpackers-backend folder SHALL have its own wrangler.toml configuration for Cloudflare Workers deployment
6. THE BagPackers_System SHALL maintain separate version control for frontend and backend dependencies
7. THE bagpackers-frontend and bagpackers-backend folders SHALL be independently deployable without requiring the other

### Requirement 11: API Documentation and Testing

**User Story:** As a Developer, I want comprehensive API documentation, so that frontend developers can easily integrate with the backend

#### Acceptance Criteria

1. THE Cloudflare_Backend SHALL generate OpenAPI/Swagger documentation for all API endpoints
2. THE Cloudflare_Backend SHALL expose API documentation at the /server/docs endpoint
3. THE Cloudflare_Backend SHALL include request/response schemas in the API documentation
4. THE Cloudflare_Backend SHALL include authentication requirements in the API documentation
5. WHERE an API endpoint requires authentication, THE API documentation SHALL clearly indicate the JWT_Token requirement
