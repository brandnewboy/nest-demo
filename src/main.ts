import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { createLogger } from 'winston';
import * as winston from 'winston';
import {
	utilities,
	WinstonModule,
	WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston';
import 'winston-daily-rotate-file';
import { resolve } from 'node:path';

// TODO 滚动生成日志文件
async function bootstrap() {
	// const instance = createLogger({
	// 	transports: [
	// 		new winston.transports.Console({
	// 			level: 'verbose',
	// 			format: winston.format.combine(
	// 				winston.format.timestamp(),
	// 				utilities.format.nestLike('zhang li'),
	// 			),
	// 		}),
	// 		new winston.transports.DailyRotateFile({
	// 			level: 'warn',
	// 			dirname: resolve(__dirname, '../logs'),
	// 			filename: '%DATE%.log',
	// 			datePattern: 'YYYY-MM-DD-HH',
	// 			zippedArchive: true,
	// 			maxSize: '20m', // 每个日志文件的最大大小为20MB
	// 			maxFiles: '14d', // 保留14天的日志文件
	// 			format: winston.format.combine(
	// 				winston.format.timestamp(),
	// 				utilities.format.nestLike('zhang li', {
	// 					colors: false,
	// 					prettyPrint: false,
	// 				}),
	// 			),
	// 		}),
	// 	],
	// });
	//
	// const logger = WinstonModule.createLogger({
	// 	instance,
	// });
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
	// logger.log(`Application listening on port 8001`);
}

bootstrap();
