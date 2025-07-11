import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * 与内置的ClassSerializerInterceptor类似，如果像拓展，按照这个模式拓展即可
 * 与之对应的 @DesensitizeResponse 装饰器用于获取对应数据的class
 */
@Injectable()
export class ResponseSerializerInterceptor<T> implements NestInterceptor {
	constructor(private readonly clazz: ClassConstructor<T>) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map(resBody => {
				return plainToInstance(this.clazz, resBody, {
					enableImplicitConversion: true,
					enableCircularCheck: true,
				});
			}),
		);
	}
}
