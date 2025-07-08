import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger,
	LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger: LoggerService = new Logger(
		HttpExceptionFilter.name,
	);

	constructor() {}

	catch(exception: HttpException, host: ArgumentsHost): any {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		const status = exception.getStatus();
		const message = exception.message || exception.name;
		const error = exception.getResponse();

		this.logger.error(
			`${request.method} ${request.url} : ${message}`,
			exception.stack,
		);

		response.status(status).json({
			code: status,
			ip: request.ip,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
			error,
			errorType: exception.name,
		});
	}
}
