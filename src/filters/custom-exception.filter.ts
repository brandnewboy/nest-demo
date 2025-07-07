import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
	LoggerService,
} from '@nestjs/common';
import { CustomException } from '../exception/custom-exception';
import { Request, Response } from 'express';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
	private readonly logger: LoggerService = new Logger();

	constructor() {}

	catch(exception: CustomException, host: ArgumentsHost): any {
		this.logger.verbose(
			`CustomExceptionFilter called`,
			'CustomExceptionFilter',
		);
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();
		const message = exception.message;
		const customStatusCode = exception.statusCode;

		this.logger.error(
			`${request.method} ${request.url} : ${message}`,
			'CustomExceptionFilter',
		);

		response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			code: customStatusCode,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
		});
	}
}
