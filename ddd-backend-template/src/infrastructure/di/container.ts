import TYPES from 'infrastructure/types';
import 'reflect-metadata';
import { container } from 'tsyringe';

// Register service implementations here
// Example:
// container.registerSingleton<IExampleService>(TYPES.IExampleService, ExampleService);

export { container as diContainer };

