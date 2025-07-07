import {
	Body,
	Controller,
	Delete,
	Get,
	Query,
	Logger,
	LoggerService,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('user')
export class UserController {
	private readonly logger: LoggerService = new Logger(UserController.name);

	constructor(
		private readonly userService: UserService,
		private readonly config: ConfigService,
	) {}

	@Get('')
	getUsers(@Query() query: QueryUserDto): any {
		this.logger.verbose('query: ' + JSON.stringify(query));
		return this.userService.findAll(query);
	}

	@Get('info/:id')
	getUser(@Param('id') id: number): any {
		return this.userService.getUserById(id);
	}

	@Post('')
	addUser(@Body() dto: any): any {
		this.logger.log('add user: ', dto);
		return 'add user';
	}

	@Patch('/:id')
	updateUser(@Body() dto: any, @Param('id') id: number): any {
		return 'update user';
	}

	@Delete('/:id')
	deleteUser(@Param('id') id: number): any {
		return 'delete user';
	}

	@Get('/profile')
	getProfile(): any {
		return 'get profile';
	}

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
}
