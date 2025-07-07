import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
	app.setGlobalPrefix('api/v1');

	/**
	 * warning 注意
	 * 当将捕获所有异常的过滤器与绑定到特定类型的过滤器结合使用时，
	 * 应首先声明"捕获所有"过滤器，以便特定过滤器能正确处理绑定类型。
	 *
	 * 也就是说，将捕获所有异常的过滤器放在最前面!!!
	 */
	app.useGlobalFilters(new AllExceptionFilter());

	app.useGlobalFilters(new CustomExceptionFilter());
	app.useGlobalFilters(new HttpExceptionFilter());

	await app.listen(8001);
}

bootstrap();
