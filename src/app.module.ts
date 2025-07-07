import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';
import { resolve } from 'node:path';
import { connectOptions } from '../ormconfig';

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
	],
	controllers: [],
	providers: [Logger],
	exports: [Logger],
})
export class AppModule {}
