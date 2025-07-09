export enum ConfigEnum {
	APP_NAME = 'appName',

	DB_HOST = 'db.mysql.host',
	DB_PORT = 'db.mysql.port',
	DB_USERNAME = 'db.mysql.username',
	DB_PASSWORD = 'db.mysql.password',
	DB_DATABASE = 'db.mysql.database',
	MONGO_URI = 'db.mongodb.uri',

	LOG_ON = 'log.on',
	LOG_CONSOLE_LEVEL = 'log.consoleLevel',
	LOG_FILE_LEVEL = 'log.fileLevel',
	LOG_DIR = 'log.dir',
	LOG_FILENAME = 'log.filename',

	TOKEN_SECRET = 'token.secret',
	TOKEN_EXPIRES_IN = 'token.expiresIn',

	ROUTES_WHITE_LIST = 'routes.whiteList',
}
