import { Module } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston/dist/winston.interfaces';
import { ConfigEnum } from '../common/enum/config.enum';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';

const createConsoleTransport = (config: ConfigService) => {
	return new winston.transports.Console({
		level: config.get(ConfigEnum.LOG_CONSOLE_LEVEL),
		format: winston.format.combine(
			winston.format.timestamp(),
			utilities.format.nestLike(config.get(ConfigEnum.APP_NAME)),
		),
	});
};

const createDailyRotateFileTransport = (config: ConfigService) => {
	return new winston.transports.DailyRotateFile({
		level: config.get(ConfigEnum.LOG_FILE_LEVEL),
		dirname: config.get(ConfigEnum.LOG_DIR),
		filename: config.get(ConfigEnum.LOG_FILENAME),
		datePattern: 'YYYY-MM-DD-HH',
		zippedArchive: true,
		maxSize: '20m', // 每个日志文件的最大大小为20MB
		maxFiles: '14d', // 保留14天的日志文件
		format: winston.format.combine(
			winston.format.timestamp(),
			utilities.format.nestLike(config.get(ConfigEnum.APP_NAME), {
				colors: false,
				prettyPrint: false,
			}),
		),
	});
};

@Module({
	imports: [
		WinstonModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				const module: WinstonModuleOptions = {
					transports: [
						createConsoleTransport(config),
						createDailyRotateFileTransport(config),
					],
				};
				return module;
			},
		}),
	],
	providers: [LogsService],
	controllers: [LogsController],
})
export class LogsModule {}
