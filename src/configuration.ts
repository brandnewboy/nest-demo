import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as yaml from 'js-yaml';
import { ConfigObject } from '@nestjs/config';
import { merge } from 'lodash';

type IMode = 'development' | 'production' | 'test';

const mode: IMode = (process.env.NODE_ENV || 'development') as IMode;

console.log('now is running in ', mode, ' mode');

const COMMON_CONFIG_FILE = 'config.yml';
const RUN_ENV_FILE = `config.${mode}.yml`;

const COMMON_FILE_PATH = resolve(__dirname, './config', COMMON_CONFIG_FILE);
const RUN_ENV_PATH = resolve(__dirname, './config', RUN_ENV_FILE);

export default () => {
	const commonConfigFile = readFileSync(COMMON_FILE_PATH, 'utf-8');
	const runEnvFile = readFileSync(RUN_ENV_PATH, 'utf-8');
	const configFile = merge(
		yaml.load(commonConfigFile),
		yaml.load(runEnvFile),
	) as ConfigObject;
	return configFile;
};
