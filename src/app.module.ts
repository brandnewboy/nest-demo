import {
	ClassSerializerInterceptor,
	Global,
	Logger,
	Module,
	Provider,
	ValidationPipe,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEnum } from '@common/enum/config.enum';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';
import { connectOptions } from '../ormconfig';
import { UtilsModule } from './utils/utils.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from '@common/guards/jwt.guard';

/**
 * 创建需要参与DI系统的提供者
 * @returns {Provider[]}
 */
function createDIProviders(): Provider[] {
	return [
		{
			provide: APP_PIPE,
			useFactory: () => {
				return new ValidationPipe({
					transform: true,
					// 白名单 只接受DTO定义时进行装饰过的字段，避免敏感不安全的字段被提交
					whitelist: true,
					transformOptions: {
						// 隐式类型转换 以便于query参数中string类型的数字 能被转换成number类型
						enableImplicitConversion: true,
					},
				});
			},
		},
		{
			provide: APP_GUARD,
			useClass: JwtGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
	];
}

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: true,
			load: [Configuration],
			// TODO 配置文件字段校验 - Joi zod
		}),
		TypeOrmModule.forRoot(connectOptions),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				uri: config.get(ConfigEnum.MONGO_URI),
			}),
		}),
		UserModule,
		LogsModule,
		RolesModule,
		UtilsModule,
		AuthModule,
	],
	controllers: [],
	providers: [Logger, ...createDIProviders()],
	exports: [Logger],
})
export class AppModule {}
