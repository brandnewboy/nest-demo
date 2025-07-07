import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';
// TODO 滚动生成日志文件
async function bootstrap() {
	// const logger = new Logger();

	const instance = createLogger({
		transports: [
			new winston.transports.Console({
				format: winston.format.combine(
					winston.format.timestamp(),
					utilities.format.nestLike('zhang li'),
				),
			}),
		],
	});

	const logger = WinstonModule.createLogger({
		instance,
	});
	const app = await NestFactory.create(AppModule, {
		// logger: ['error', 'warn', 'debug', 'log', 'verbose'],
		logger,
	});
	app.setGlobalPrefix('api/v1');

	/**
	 * warning 注意
	 * 当将捕获所有异常的过滤器与绑定到特定类型的过滤器结合使用时，
	 * 应首先声明"捕获所有"过滤器，以便特定过滤器能正确处理绑定类型。
	 *
	 * 也就是说，将捕获所有异常的过滤器放在最前面!!!
	 */
	app.useGlobalFilters(new AllExceptionFilter(logger));

	app.useGlobalFilters(new CustomExceptionFilter(logger));
	app.useGlobalFilters(new HttpExceptionFilter(logger));

	await app.listen(8001);
	// logger.log(`Application listening on port 8001`);
}

bootstrap();
