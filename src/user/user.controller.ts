import {
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Inject,
	Logger,
	LoggerService,
	Param,
	Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { CustomException } from '../exception/custom-exception';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('user')
export class UserController {
	private readonly logger = new Logger(UserController.name);

	constructor(
		private readonly userService: UserService,
		private readonly config: ConfigService,

		// @Inject(WINSTON_MODULE_NEST_PROVIDER)
		// private readonly logger: Logger,
	) {
		this.logger.log('UserController created');
	}

	// @Get()
	// getUsers(): any {
	// 	return this.userService.getUsers();
	// }

	// @Get('/:id')
	// getUserById(id: number): any {
	// 	return this.userService.getUserById(id);
	// }
	//
	// @Get('/:id/profile')
	// getProfileByUserId(@Param() params: any): any {
	// 	return this.userService.getProfile(params.id);
	// }
	//
	// @Get('/:id/logs')
	// getUserLogs(@Param() params: any): any {
	// 	return this.userService.getOperationLogs(params.id);
	// }
	//
	// @Get('/profile/:id')
	// getProfileById(@Param() params: any): any {
	// 	return this.userService.getProfileById(params.id);
	// }

	@Post('/logs-group')
	async getLogsGroup(): Promise<any> {
		this.logger.log('/logs-group');
		const res = await this.userService.getLogsByGroup(3);
		return res.map(o => {
			return {
				result: o.result,
				count: Number(o.count),
			};
		});
	}

	// @Post()
	// createUser(): any {
	// 	return this.userService.createUser();
	// }

	@Get('/config')
	getConfig() {
		return this.config.get('db.mysql2');
	}

	@Get('/exception-test')
	exceptionTest() {
		const e = new HttpException('this is a test', HttpStatus.FORBIDDEN);
		throw e;
	}

	@Get('/exception-test2')
	exceptionTest2() {
		const e = new CustomException(
			'❌❌🔄this is a custom exception test',
			9999,
		);
		throw e;
	}

	@Get('/exception-test3')
	exceptionTest3() {
		const e = new Error('❌🔄🔄❌🔄this is a all exception test');
		throw e;
	}
}
