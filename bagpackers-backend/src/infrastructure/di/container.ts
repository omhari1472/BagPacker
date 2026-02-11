import 'reflect-metadata';
import { container } from 'tsyringe';
import { TOKENS, type Env } from '../types';

// Import repositories
import { UserRepository } from '@repository/auth/user.repository';
import { BookingRepository } from '@repository/booking/booking.repository';
import { PaymentRepository } from '@repository/payment/payment.repository';
import { PartnerRepository } from '@repository/partner/partner.repository';
import { LocationRepository } from '@repository/location/location.repository';

// Import services
import { RazorpayService } from '@services/razorpay/razorpay.service';
import { GoogleOAuthService } from '@services/oauth/google-oauth.service';

// Import controllers
import { AuthController } from '@controllers/auth/auth.controller';
import { BookingController } from '@controllers/booking/booking.controller';
import { PaymentController } from '@controllers/payment/payment.controller';
import { PartnerController } from '@controllers/partner/partner.controller';

/**
 * Setup dependency injection container
 * Registers all repositories, services, and controllers
 * @param env - Environment variables
 */
export function setupDependencyInjection(env: Env) {
	// Register repositories
	container.register(TOKENS.USER_REPOSITORY, { useClass: UserRepository });
	container.register(TOKENS.BOOKING_REPOSITORY, { useClass: BookingRepository });
	container.register(TOKENS.PAYMENT_REPOSITORY, { useClass: PaymentRepository });
	container.register(TOKENS.PARTNER_REPOSITORY, { useClass: PartnerRepository });
	container.register(TOKENS.LOCATION_REPOSITORY, { useClass: LocationRepository });

	// Register services with environment dependencies
	container.register(TOKENS.RAZORPAY_SERVICE, {
		useFactory: () => new RazorpayService(env),
	});
	container.register(TOKENS.GOOGLE_OAUTH_SERVICE, {
		useFactory: () => new GoogleOAuthService(env),
	});

	// Register controllers with JWT secret
	container.register(TOKENS.AUTH_CONTROLLER, {
		useFactory: () => {
			const userRepository = container.resolve<UserRepository>(TOKENS.USER_REPOSITORY);
			const googleOAuthService = container.resolve<GoogleOAuthService>(TOKENS.GOOGLE_OAUTH_SERVICE);
			return new AuthController(userRepository, googleOAuthService, env.JWT_SECRET);
		},
	});

	container.register(TOKENS.BOOKING_CONTROLLER, {
		useFactory: () => {
			const bookingRepository = container.resolve<BookingRepository>(TOKENS.BOOKING_REPOSITORY);
			const locationRepository = container.resolve<LocationRepository>(TOKENS.LOCATION_REPOSITORY);
			return new BookingController(bookingRepository, locationRepository);
		},
	});

	container.register(TOKENS.PAYMENT_CONTROLLER, {
		useFactory: () => {
			const paymentRepository = container.resolve<PaymentRepository>(TOKENS.PAYMENT_REPOSITORY);
			const bookingRepository = container.resolve<BookingRepository>(TOKENS.BOOKING_REPOSITORY);
			const razorpayService = container.resolve<RazorpayService>(TOKENS.RAZORPAY_SERVICE);
			return new PaymentController(paymentRepository, bookingRepository, razorpayService);
		},
	});

	container.register(TOKENS.PARTNER_CONTROLLER, { useClass: PartnerController });
}

export { container };
