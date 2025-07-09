import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IReqPayloadUser } from '../../auth/auth.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LoggingInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		const request = ctx.getRequest();
		const user = request.user as IReqPayloadUser;
		const path = request.url;
		const method = request.method;
		this.logger.log(`${method} ${path} ${user?.username || 'anonymous'}`);

		return next.handle();
	}
}
