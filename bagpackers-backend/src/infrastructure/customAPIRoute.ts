import { OpenAPIRoute } from 'chanfana';
import type { IAuthRequest } from './core.model';

export class CustomOpenAPIRoute extends OpenAPIRoute {
	declare request: IAuthRequest;
}
