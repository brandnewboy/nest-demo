import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { TypeORMError, QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
	private readonly logger = new Logger(TypeormFilter.name);
	catch(exception: TypeORMError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		let message = exception.message || exception.name;
		let code: number = HttpStatus.INTERNAL_SERVER_ERROR;
		if (exception instanceof QueryFailedError) {
			code = exception.driverError.errno;
			if (code === 1062) {
				message = `唯一索引冲突: ${message}`;
			}
		}

		this.logger.error(
			`${request.method} ${request.url} : ${message}`,
			exception.stack,
		);

		response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			code,
			ip: request.ip,
			message,
			timestamp: new Date().toISOString(),
			errorType: exception.name,
		});
	}
}
