// Simple logger utility - replace with your preferred logging solution
class Logger {
	async info(message: string, data?: any) {
		console.log(`[INFO] ${message}`, data || '');
	}

	async error(message: string, data?: any) {
		console.error(`[ERROR] ${message}`, data || '');
	}

	async warn(message: string, data?: any) {
		console.warn(`[WARN] ${message}`, data || '');
	}

	async debug(message: string, data?: any) {
		console.debug(`[DEBUG] ${message}`, data || '');
	}
}

const logger = new Logger();
export default logger;

