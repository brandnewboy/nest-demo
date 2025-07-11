import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { RESPONSE_TYPE_KEY } from '@common/decorators/desensitize-response.decorator';

/**
 * 与内置的ClassSerializerInterceptor类似，如果想拓展，按照这个模式拓展即可
 * 与之对应的 @DesensitizeResponse 装饰器用于获取对应数据的class
 * 目前应用使用的是内置的ClassSerializerInterceptor，后续可以考虑拓展这个拦截器
 */
@Injectable()
export class ResponseSerializerInterceptor<T = unknown>
	implements NestInterceptor
{
	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const clazz = this.reflector.get(
			RESPONSE_TYPE_KEY,
			context.getHandler(),
		) as ClassConstructor<T>;

		return next.handle().pipe(
			map(resBody => {
				return plainToInstance(clazz, resBody, {
					enableImplicitConversion: true,
					enableCircularCheck: true,
				});
			}),
		);
	}
}
