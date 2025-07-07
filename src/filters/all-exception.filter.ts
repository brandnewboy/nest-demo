import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerService) {}

	catch(exception: Error, host: ArgumentsHost): any {
		this.logger.verbose(`AllExceptionFilter called`, 'AllExceptionFilter');
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();
		const message = exception.message;
		const customStatusCode = 90001;

		this.logger.error(
			`${request.method} ${request.url} : ${message}`,
			'AllExceptionFilter',
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
