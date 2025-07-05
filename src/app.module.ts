import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import * as Joi from 'joi';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: true,
			load: [Configuration],
			// TODO 配置文件字段校验 - Joi
			// validationSchema: Joi.object({
			// 	db: Joi.object({
			// 		mysql: Joi.object({
			// 			port: Joi.number().port().required(),
			// 			username: Joi.string().required(),
			// 			password: Joi.string().required(),
			// 		}).required(),
			// 		mongodb: Joi.object({
			// 			uri: Joi.string().uri().required(),
			// 		}).required(),
			// 	}).required(),
			// }),
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: 'mysql',
				host: config.get(ConfigEnum.DB_HOST),
				port: config.get(ConfigEnum.DB_PORT),
				username: config.get(ConfigEnum.DB_USERNAME),
				password: config.get(ConfigEnum.DB_PASSWORD),
				database: config.get(ConfigEnum.DB_DATABASE),
				entities: [User, Profile],
				synchronize: true, // 同步本地的schema与数据库的schema
				logging: ['error', 'info'],
			}),
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				uri: config.get(ConfigEnum.MONGO_URI),
			}),
		}),
		UserModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
