import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import bcrypt from 'bcrypt';
import { BaseRepository } from '../repository';
import { users } from '../schema';

export interface CreateUserData {
	firstName: string;
	lastName: string;
	email: string;
	password?: string;
	authProvider?: 'local' | 'google';
}

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	authProvider: string;
	createdAt: Date;
	updatedAt: Date;
}

@injectable()
export class UserRepository extends BaseRepository {
	private readonly SALT_ROUNDS = 10;

	/**
	 * Find a user by email address
	 */
	async findByEmail(email: string): Promise<User | null> {
		const result = await this.db
			.select({
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				email: users.email,
				authProvider: users.authProvider,
				createdAt: users.createdAt,
				updatedAt: users.updatedAt,
			})
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (!result[0]) return null;

		return {
			id: result[0].id,
			firstName: result[0].firstName,
			lastName: result[0].lastName,
			email: result[0].email,
			authProvider: result[0].authProvider || 'local',
			createdAt: result[0].createdAt!,
			updatedAt: result[0].updatedAt!,
		};
	}

	/**
	 * Find a user by ID
	 */
	async findById(id: number): Promise<User | null> {
		const result = await this.db
			.select({
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				email: users.email,
				authProvider: users.authProvider,
				createdAt: users.createdAt,
				updatedAt: users.updatedAt,
			})
			.from(users)
			.where(eq(users.id, id))
			.limit(1);

		if (!result[0]) return null;

		return {
			id: result[0].id,
			firstName: result[0].firstName,
			lastName: result[0].lastName,
			email: result[0].email,
			authProvider: result[0].authProvider || 'local',
			createdAt: result[0].createdAt!,
			updatedAt: result[0].updatedAt!,
		};
	}

	/**
	 * Create a new user with password hashing
	 */
	async createUser(data: CreateUserData): Promise<User> {
		let hashedPassword: string | undefined;

		// Hash password if provided (for local auth)
		if (data.password) {
			hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);
		}

		const result = await this.db.insert(users).values({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: hashedPassword,
			authProvider: data.authProvider || 'local',
		});

		const insertId = Number(result[0].insertId);
		const user = await this.findById(insertId);

		if (!user) {
			throw new Error('Failed to create user');
		}

		return user;
	}

	/**
	 * Verify user password for authentication
	 */
	async verifyPassword(email: string, password: string): Promise<User | null> {
		const result = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		const user = result[0];

		if (!user || !user.password) {
			return null;
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			return null;
		}

		// Return user without password
		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			authProvider: user.authProvider || 'local',
			createdAt: user.createdAt!,
			updatedAt: user.updatedAt!,
		};
	}
}
