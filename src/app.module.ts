import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';
import { connectOptions } from '../ormconfig';
import { UtilsModule } from './utils/utils.module';

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
	],
	controllers: [],
	providers: [Logger],
	exports: [Logger],
})
export class AppModule {}
