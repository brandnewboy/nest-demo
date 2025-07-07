import { ConfigEnum } from './src/enum/config.enum';
import { resolve } from 'node:path';
import configuration from './src/configuration';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = new ConfigService(configuration());

export const connectOptions = {
	type: 'mysql',
	host: config.get(ConfigEnum.DB_HOST),
	port: config.get(ConfigEnum.DB_PORT),
	username: config.get(ConfigEnum.DB_USERNAME),
	password: config.get(ConfigEnum.DB_PASSWORD),
	database: config.get(ConfigEnum.DB_DATABASE),
	entities: [resolve(__dirname, './**/*.entity.{ts,js}')],
	synchronize: true, // 同步本地的schema与数据库的schema
	logging: process.env.NODE_ENV === 'development',
} as DataSourceOptions;

/**
 * 提供给TypeORM CLI识别
 * 在迁移等一些复杂工作使用
 * 复杂工作使用该方式更为合理，更能保持数据库数据的完整性、一致性等
 */
export default new DataSource({
	...connectOptions,
	migrations: [resolve(__dirname, './src/migrations/*.{ts,js}')],
	subscribers: [],
});
