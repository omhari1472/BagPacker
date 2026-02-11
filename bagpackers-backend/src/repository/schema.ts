import { mysqlTable, serial, varchar, int, decimal, date, timestamp, text } from 'drizzle-orm/mysql-core';

// Users Table
export const users = mysqlTable('users', {
	id: serial('id').primaryKey(),
	firstName: varchar('first_name', { length: 100 }).notNull(),
	lastName: varchar('last_name', { length: 100 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	password: varchar('password', { length: 255 }), // nullable for OAuth users
	authProvider: varchar('auth_provider', { length: 50 }).default('local'), // 'local' or 'google'
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Bookings Table
export const bookings = mysqlTable('bookings', {
	id: serial('id').primaryKey(),
	userId: int('user_id').notNull().references(() => users.id),
	region: varchar('region', { length: 255 }).notNull(),
	city: varchar('city', { length: 100 }).notNull(),
	numberOfBags: int('number_of_bags').notNull(),
	dropOffDate: date('drop_off_date').notNull(),
	pickupDate: date('pickup_date').notNull(),
	totalCost: decimal('total_cost', { precision: 10, scale: 2 }).notNull(),
	status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'confirmed', 'completed', 'cancelled'
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Payments Table
export const payments = mysqlTable('payments', {
	id: serial('id').primaryKey(),
	bookingId: int('booking_id').notNull().references(() => bookings.id),
	razorpayOrderId: varchar('razorpay_order_id', { length: 255 }),
	razorpayPaymentId: varchar('razorpay_payment_id', { length: 255 }),
	razorpaySignature: varchar('razorpay_signature', { length: 255 }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	currency: varchar('currency', { length: 10 }).default('INR'),
	status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'success', 'failed'
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Partners Table
export const partners = mysqlTable('partners', {
	id: serial('id').primaryKey(),
	fullName: varchar('full_name', { length: 255 }).notNull(),
	region: varchar('region', { length: 255 }).notNull(),
	mobileNumber: varchar('mobile_number', { length: 20 }).notNull(),
	address: text('address').notNull(),
	status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'approved', 'rejected'
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Partner Locations Table (for map display)
export const partnerLocations = mysqlTable('partner_locations', {
	id: serial('id').primaryKey(),
	partnerId: int('partner_id').notNull().references(() => partners.id),
	region: varchar('region', { length: 255 }).notNull(),
	city: varchar('city', { length: 100 }).notNull(),
	latitude: decimal('latitude', { precision: 10, scale: 8 }),
	longitude: decimal('longitude', { precision: 11, scale: 8 }),
	availableSpaces: int('available_spaces').default(0),
	pricePerBag: decimal('price_per_bag', { precision: 10, scale: 2 }).default('30.00'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});
