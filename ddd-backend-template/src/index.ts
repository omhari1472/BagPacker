import exampleRouter from '@routes/example/example.router';
import { fromIttyRouter } from 'chanfana';
import type { IAuthRequest } from 'infrastructure/core.model';
import { AutoRouter, cors, error, json } from 'itty-router';

const { preflight, corsify } = cors({
	origin: ['http://localhost:3000', 'http://localhost:3001'],
	allowHeaders: ['Content-Type', 'Authorization', 'authorization'],
	allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	exposeHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
});

const wrappedCorsify = (response: Response, request?: Request): Response => {
	if (response?.status === 302) {
		return response;
	}
	return corsify(response, request);
};

const router = AutoRouter({
	before: [preflight],
	finally: [wrappedCorsify],
});

const openapi = fromIttyRouter(router, {
	schema: {
		info: {
			title: 'DDD Backend Template API',
			version: '1.0.0',
			description: 'Domain-Driven Design Backend Template with OpenAPI',
		},
		security: [
			{
				JWTToken: [],
			},
		],
	},
	docs_url: '/server/docs',
	raiseUnknownParameters: true,
});

openapi.registry.registerComponent('securitySchemes', 'JWTToken', {
	type: 'apiKey',
	in: 'header',
	name: 'Authorization',
});

// Register routes
openapi.all('/example/*', exampleRouter);

// Health check endpoint
openapi.get('/health', () => {
	return json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default {
	fetch: router.handle,
};

