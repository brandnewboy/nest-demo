import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
	LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	private readonly logger: LoggerService = new Logger(
		AllExceptionFilter.name,
	);

	constructor() {}

	catch(exception: Error, host: ArgumentsHost): any {
		this.logger.verbose(`AllExceptionFilter called`, 'AllExceptionFilter');
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();
		const message = exception.message;
		const customStatusCode = 90001;

		this.logger.error(
			`${request.method} ${request.url} : ${message}`,
			exception.stack,
		);

		response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			code: customStatusCode,
			ip: request.ip,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
		});
	}
}
