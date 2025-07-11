import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
	LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Result } from '@common/dto/result.dto';

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

		let message = exception.message || exception.name || '服务器错误';

		this.logger.error(
			`${request.method} ${request.url} : ${message}`,
			exception.stack,
		);

		if (exception.name === 'TokenExpiredError') {
			message = 'Token 已过期，请重新登录';
		}

		const resBody = Result.fail(HttpStatus.INTERNAL_SERVER_ERROR, message, {
			ip: request.ip,
			timestamp: new Date().toISOString(),
			path: request.url,
			error: exception,
			errorType: exception.name,
		});
		response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(resBody);
	}
}
