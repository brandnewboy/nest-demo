import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerService) {}

	catch(exception: HttpException, host: ArgumentsHost): any {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		const message = exception.message || exception.name;
		const error = exception.getResponse();

		this.logger.error(
			`${request.method} ${request.url} : ${message}`,
			'HttpExceptionFilter',
		);

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
			error,
		});
	}
}
