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
		let message = exception.message || exception.name;
		const error = exception.getResponse();

		/**
		 * 某些第三方库抛出的异常对象或者自定义的响应对象可能不是标准的 Error 类型，
		 * 但是包含详细的错误信息，在此进行处理
		 */
		if (
			typeof error === 'object' &&
			(error instanceof Error || 'message' in error)
		) {
			message = Array.isArray(error.message)
				? error.message.join('++AND++')
				: (error.message as string) || message;
		}

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
