# Implementation Plan

- [x] 1. Initialize Backend Project Structure
  - Create bagpackers-backend folder with Cloudflare Workers template
  - Set up TypeScript configuration with path aliases
  - Configure wrangler.toml for Cloudflare Workers deployment
  - Install dependencies (drizzle-orm, tsyringe, chanfana, itty-router, zod, bcrypt, jsonwebtoken)
  - Set up Biome for code formatting and linting
  - _Requirements: 7.1, 7.5, 10.1, 10.5_

- [x] 2. Set up Database Schema and Repository Layer
  - [x] 2.1 Create Drizzle schema definitions
    - Define users table schema with authentication fields
    - Define bookings table schema with foreign key to users
    - Define payments table schema with Razorpay fields
    - Define partners table schema for host registration
    - Define partnerLocations table schema for map display
    - _Requirements: 9.1, 1.1, 3.1, 4.5, 6.1_

  - [x] 2.2 Configure Drizzle ORM connection
    - Create drizzle.config.ts with database connection settings
    - Set up database connection in repository base class
    - _Requirements: 7.3, 9.1_

  - [ ] 2.3 Implement user repository
    - Create user.repository.ts with CRUD operations
    - Implement findByEmail method for authentication
    - Implement createUser method with password hashing
    - Implement findById method for user retrieval
    - _Requirements: 1.1, 1.2, 7.3_

  - [x] 2.4 Implement booking repository
    - Create booking.repository.ts with CRUD operations
    - Implement createBooking method
    - Implement findBookingsByUserId method
    - Implement findBookingById method
    - Implement updateBookingStatus method
    - _Requirements: 3.1, 3.6, 7.3_

  - [x] 2.5 Implement payment repository
    - Create payment.repository.ts with CRUD operations
    - Implement createPayment method
    - Implement updatePaymentStatus method
    - Implement findPaymentByBookingId method
    - _Requirements: 4.5, 7.3_

  - [x] 2.6 Implement partner repository
    - Create partner.repository.ts with CRUD operations
    - Implement createPartner method
    - Implement findPartnersByRegion method
    - _Requirements: 6.1, 7.3_

  - [x] 2.7 Implement location repository
    - Create location.repository.ts for partner locations
    - Implement findLocationsByRegion method for map display
    - _Requirements: 5.2, 7.3_

- [x] 3. Implement External Services
  - [x] 3.1 Create Razorpay payment service
    - Create razorpay.service.ts in services/razorpay folder
    - Implement createOrder method to generate Razorpay order
    - Implement verifyPaymentSignature method for payment verification
    - Configure Razorpay API keys from environment variables
    - _Requirements: 4.3, 4.4, 7.4_

  - [x] 3.2 Create Google OAuth service
    - Create google-oauth.service.ts in services/oauth folder
    - Implement getGoogleAuthUrl method
    - Implement verifyGoogleToken method
    - Implement getUserInfo method to fetch user profile
    - Configure Google OAuth credentials from environment variables
    - _Requirements: 1.3, 7.4_

- [x] 4. Implement Authentication Controllers
  - [x] 4.1 Create user registration controller
    - Create auth.controller.ts in controllers/auth folder
    - Implement registerUser method with validation
    - Hash password using bcrypt before storing
    - Generate JWT token after successful registration
    - Handle duplicate email errors
    - _Requirements: 1.1, 1.4, 1.5, 7.2_

  - [x] 4.2 Create user login controller
    - Implement loginUser method in auth.controller.ts
    - Validate email and password
    - Compare hashed passwords using bcrypt
    - Generate JWT token after successful login
    - Handle invalid credentials errors
    - _Requirements: 1.2, 7.2_

  - [x] 4.3 Create Google OAuth controller
    - Implement googleOAuthCallback method in auth.controller.ts
    - Call Google OAuth service to verify token
    - Create or retrieve user account based on Google profile
    - Generate JWT token for OAuth users
    - _Requirements: 1.3, 7.2_

  - [x] 4.4 Create get current user controller
    - Implement getCurrentUser method in auth.controller.ts
    - Extract user ID from JWT token
    - Retrieve user details from repository
    - _Requirements: 1.7, 7.2_

- [x] 5. Implement Booking Controllers
  - [x] 5.1 Create booking creation controller
    - Create booking.controller.ts in controllers/booking folder
    - Implement createBooking method with validation
    - Validate drop-off date is not in the past
    - Validate pickup date is after drop-off date
    - Calculate total cost (numberOfBags * 30)
    - Extract user ID from JWT token
    - Call booking repository to create booking
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 7.2_

  - [x] 5.2 Create get bookings controller
    - Implement getUserBookings method in booking.controller.ts
    - Extract user ID from JWT token
    - Retrieve all bookings for the user from repository
    - _Requirements: 3.6, 7.2_

  - [x] 5.3 Create get locations controller
    - Implement getLocationsByRegion method in booking.controller.ts
    - Accept region and city as query parameters
    - Call location repository to fetch partner locations
    - _Requirements: 5.2, 7.2_

- [x] 6. Implement Payment Controllers
  - [x] 6.1 Create payment order controller
    - Create payment.controller.ts in controllers/payment folder
    - Implement createPaymentOrder method
    - Validate booking exists and belongs to user
    - Call Razorpay service to create order
    - Create payment record in database
    - Return order ID and amount to frontend
    - _Requirements: 4.3, 4.5, 7.2_

  - [x] 6.2 Create payment verification controller
    - Implement verifyPayment method in payment.controller.ts
    - Call Razorpay service to verify payment signature
    - Update payment status to success or failed
    - Update booking status to confirmed if payment successful
    - _Requirements: 4.4, 4.5, 7.2_

- [x] 7. Implement Partner Controllers
  - [x] 7.1 Create partner registration controller
    - Create partner.controller.ts in controllers/partner folder
    - Implement registerPartner method with validation
    - Validate mobile number format
    - Call partner repository to create partner record
    - _Requirements: 6.1, 6.2, 6.3, 7.2_

- [x] 8. Implement Authentication Middleware
  - Create auth.middleware.ts in middlewares folder
  - Implement JWT token validation
  - Extract and verify JWT token from Authorization header
  - Decode token and attach user ID to request context
  - Handle expired token errors
  - Handle invalid token errors
  - _Requirements: 1.8, 7.8_

- [x] 9. Implement API Routes with OpenAPI Documentation
  - [x] 9.1 Create authentication routes
    - Create register.route.ts with Zod schema for registration
    - Create login.route.ts with Zod schema for login
    - Create oauth.route.ts for Google OAuth callback
    - Create me.route.ts for getting current user (protected)
    - Add OpenAPI documentation for all auth endpoints
    - _Requirements: 7.1, 7.6, 11.1, 11.2, 11.3_

  - [x] 9.2 Create booking routes
    - Create create-booking.route.ts with Zod schema (protected)
    - Create get-bookings.route.ts for user bookings (protected)
    - Create get-locations.route.ts for partner locations
    - Add OpenAPI documentation for all booking endpoints
    - _Requirements: 7.1, 7.6, 11.1, 11.2, 11.3_

  - [x] 9.3 Create payment routes
    - Create create-order.route.ts with Zod schema (protected)
    - Create verify-payment.route.ts with Zod schema (protected)
    - Add OpenAPI documentation for all payment endpoints
    - _Requirements: 7.1, 7.6, 11.1, 11.2, 11.3_

  - [x] 9.4 Create partner routes
    - Create register-partner.route.ts with Zod schema
    - Add OpenAPI documentation for partner endpoints
    - _Requirements: 7.1, 7.6, 11.1, 11.2, 11.3_

- [x] 10. Configure Dependency Injection and Main Entry Point
  - Configure TSyringe container in infrastructure/di/container.ts
  - Register all services and repositories in DI container
  - Create main index.ts with router configuration
  - Register all routes in main router
  - Configure CORS for frontend domain
  - Set up OpenAPI documentation endpoint at /server/docs
  - _Requirements: 7.5, 11.1, 11.2_

- [x] 11. Implement Custom Exceptions
  - Create auth.exceptions.ts for authentication errors
  - Create booking.exceptions.ts for booking validation errors
  - Create payment.exceptions.ts for payment processing errors
  - Implement global error handler in main router
  - _Requirements: 7.7_

- [x] 12. Create Utility Functions
  - Create jwt.utils.ts for JWT token generation and verification
  - Implement generateToken function
  - Implement verifyToken function
  - Update Response.utils.ts for consistent API responses
  - _Requirements: 1.7, 1.8_

- [x] 13. Initialize Frontend Project Structure
  - Create bagpackers-frontend folder with Angular CLI
  - Generate Angular 17+ project with standalone components
  - Configure TypeScript strict mode
  - Install dependencies (Angular Material, RxJS, date-fns)
  - Set up environment files for API URLs
  - Configure Angular routing
  - _Requirements: 8.1, 10.2, 10.3_

- [x] 14. Create Core Frontend Services and Interceptors
  - [x] 14.1 Create authentication service
    - Create auth.service.ts in core/services
    - Implement login method
    - Implement register method
    - Implement googleLogin method
    - Implement logout method
    - Implement getCurrentUser method
    - Implement token storage and retrieval
    - _Requirements: 8.2, 1.7_

  - [x] 14.2 Create storage service
    - Create storage.service.ts in core/services
    - Implement secure token storage methods
    - Implement getToken and setToken methods
    - Implement removeToken method
    - _Requirements: 1.7, 8.2_

  - [x] 14.3 Create HTTP interceptors
    - Create auth.interceptor.ts to add JWT token to requests
    - Create error.interceptor.ts to handle API errors
    - Register interceptors in app.config.ts
    - _Requirements: 8.6, 8.7_

  - [x] 14.4 Create route guard
    - Create auth.guard.ts in core/guards
    - Implement canActivate to check authentication
    - Redirect to login if not authenticated
    - _Requirements: 8.3_

- [x] 15. Implement Authentication Feature Module
  - [x] 15.1 Create login component
    - Generate login component in features/auth/components
    - Create reactive form with email and password fields
    - Implement form validation
    - Call auth service login method on submit
    - Display error messages for failed login
    - Redirect to dashboard on successful login
    - Add Google OAuth login button
    - _Requirements: 1.2, 1.3, 1.6, 8.4, 8.7_

  - [x] 15.2 Create signup component
    - Generate signup component in features/auth/components
    - Create reactive form with firstName, lastName, email, password, confirmPassword
    - Implement form validation with password matching
    - Call auth service register method on submit
    - Display error messages for validation failures
    - Redirect to dashboard on successful registration
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 8.4, 8.7_

  - [x] 15.3 Create auth API service
    - Create auth-api.service.ts in features/auth/services
    - Implement HTTP methods for login, register, OAuth
    - Handle API responses and errors
    - _Requirements: 8.2, 8.7_

- [x] 16. Implement Booking Feature Module
  - [x] 16.1 Create dashboard component
    - Generate dashboard component in features/booking/components
    - Display city selector dropdown
    - Display booking form
    - Update city image when city is selected
    - _Requirements: 2.1, 2.2, 2.4, 8.8_

  - [x] 16.2 Create booking form component
    - Generate booking-form component in features/booking/components
    - Create reactive form with region, numberOfBags, dropOffDate, pickupDate
    - Implement form validation
    - Validate dates (drop-off not in past, pickup after drop-off)
    - Call booking API service on submit
    - Navigate to map view after successful booking
    - _Requirements: 2.5, 3.1, 3.2, 3.3, 3.4, 3.7, 8.4_

  - [x] 16.3 Create location map component
    - Generate location-map component in features/booking/components
    - Display booking summary (region, bags, cost)
    - Embed map iframe showing partner locations
    - Add button to navigate to payment
    - Add button to return to dashboard
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 8.8_

  - [x] 16.4 Create booking API service
    - Create booking-api.service.ts in features/booking/services
    - Implement createBooking HTTP method
    - Implement getBookings HTTP method
    - Implement getLocations HTTP method
    - _Requirements: 8.2_

- [x] 17. Implement Payment Feature Module
  - [x] 17.1 Create payment form component
    - Generate payment-form component in features/payment/components
    - Display booking details (region, bags, cost)
    - Create form for user details (fullName, email, mobile, address)
    - Implement Razorpay checkout integration
    - Call payment API service to create order
    - Handle payment success and failure callbacks
    - _Requirements: 4.1, 4.2, 4.6, 4.7, 8.8_

  - [x] 17.2 Create payment API service
    - Create payment-api.service.ts in features/payment/services
    - Implement createPaymentOrder HTTP method
    - Implement verifyPayment HTTP method
    - _Requirements: 8.2_

  - [x] 17.3 Integrate Razorpay SDK
    - Add Razorpay script to index.html
    - Create Razorpay checkout options
    - Handle payment callbacks
    - _Requirements: 4.2, 4.3_

- [x] 18. Implement Partner Feature Module
  - [x] 18.1 Create partner landing component
    - Generate partner-landing component in features/partner/components
    - Display carousel with partner benefits
    - Display informational content about becoming a partner
    - Add navigation to partner registration form
    - _Requirements: 6.4, 6.5, 8.8_

  - [x] 18.2 Create partner form component
    - Generate partner-form component in features/partner/components
    - Create reactive form with fullName, region, mobileNumber, address
    - Implement form validation
    - Call partner API service on submit
    - Display success message after registration
    - _Requirements: 6.1, 6.2, 6.3, 6.6, 8.4_

  - [x] 18.3 Create partner API service
    - Create partner-api.service.ts in features/partner/services
    - Implement registerPartner HTTP method
    - _Requirements: 8.2_

- [x] 19. Implement Shared Components
  - [x] 19.1 Create navbar component
    - Generate navbar component in shared/components
    - Display logo and brand name
    - Display navigation links (Services, About us)
    - Display city dropdown
    - Display "Become a partner" button
    - Display user info when authenticated
    - _Requirements: 2.1, 8.5, 8.8_

  - [x] 19.2 Create city selector component
    - Generate city-selector component in shared/components
    - Display dropdown with top cities
    - Emit selected city to parent component
    - _Requirements: 2.1, 2.2, 8.5_

- [x] 20. Implement Landing Page Module
  - Create landing-page component in features/landing/components
  - Display hero section with call-to-action
  - Display navigation to login/signup
  - Display information about the service
  - _Requirements: 8.8_

- [x] 21. Configure Routing and Navigation
  - Set up app.routes.ts with all route definitions
  - Configure route guards for protected routes
  - Set up lazy loading for feature modules
  - Configure redirects (default route, after login, etc.)
  - _Requirements: 8.1, 8.3_

- [x] 22. Implement Responsive Design
  - Apply Angular Material theme
  - Create responsive layouts for all components
  - Test on mobile, tablet, and desktop viewports
  - Optimize images for different screen sizes
  - _Requirements: 8.8_

- [x] 23. Set Up Backend Environment Configuration
  - Create .env file for local development
  - Configure environment variables in wrangler.toml
  - Set up database connection string
  - Set up JWT secret
  - Set up Razorpay API keys
  - Set up Google OAuth credentials
  - _Requirements: 7.5_

- [x] 24. Set Up Frontend Environment Configuration
  - Configure environment.ts for development
  - Configure environment.prod.ts for production
  - Set API base URL for each environment
  - Set Razorpay key for each environment
  - _Requirements: 10.4_

- [x] 25. Generate and Run Database Migrations
  - Run drizzle-kit generate to create migration files
  - Review generated SQL migrations
  - Run drizzle-kit push to apply migrations to database
  - Verify all tables are created correctly
  - _Requirements: 9.1_

- [x] 26. Create Data Migration Script
  - Create migration script to export data from PHP MySQL database
  - Transform user data to match new schema
  - Transform booking data to match new schema
  - Hash existing passwords using bcrypt
  - Import transformed data into new database
  - Verify data integrity after migration
  - _Requirements: 9.2, 9.3, 9.4, 9.5_

- [ ] 27. Deploy Backend to Cloudflare Workers
  - Build backend project
  - Configure production environment variables in Cloudflare dashboard
  - Run wrangler deploy
  - Verify deployment is successful
  - Test API endpoints in production
  - _Requirements: 10.5, 10.7_

- [ ] 28. Deploy Frontend to Hosting Provider
  - Build frontend project for production
  - Configure production API URL
  - Deploy to Cloudflare Pages, Vercel, or Netlify
  - Configure custom domain and SSL certificate
  - Verify deployment is successful
  - _Requirements: 10.4, 10.6_

- [ ] 29. End-to-End Testing
  - Test user registration flow
  - Test user login flow
  - Test Google OAuth login flow
  - Test booking creation flow
  - Test payment processing flow
  - Test partner registration flow
  - Test error handling scenarios
  - _Requirements: All requirements_

- [ ] 30. Documentation and Cleanup
  - Document API endpoints in README
  - Document environment setup instructions
  - Document deployment process
  - Remove old PHP files
  - Update project README with new architecture
  - _Requirements: 11.1, 11.2, 11.3_
