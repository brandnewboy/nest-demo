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
	UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from './user.entity';
import { TypeormFilter } from '../filters/typeorm.filter';

@UseFilters(new TypeormFilter())
@Controller('user')
export class UserController {
	private readonly logger: LoggerService = new Logger(UserController.name);

	constructor(private readonly userService: UserService) {}

	@Get('')
	async getUsers(@Query() query: QueryUserDto): Promise<any> {
		this.logger.verbose('query: ' + JSON.stringify(query));
		const res = await this.userService.findAll(query);
		return {
			data: res,
		};
	}

	@Get('info/:id')
	async getUserById(@Param('id') id: number): Promise<any> {
		const res = await this.userService.findOne(id);
		delete res['logger'];
		return {
			data: res,
		};
	}

	@Post('')
	addUser(@Body() dto: User): any {
		this.logger.log('add user: ' + JSON.stringify(dto));
		const res = this.userService.create(dto);
		return {
			data: res,
		};
	}

	@Patch('/:id')
	updateUser(@Body() dto: any, @Param('id') id: number): any {
		/*TODO*
		 * 1.当前是不是用户自己在进行操作
		 * 2.判断用户是否有更新的权限
		 * 3.返回数据不能包含敏感的信息如password
		 */
		return this.userService.update(dto, id);
	}

	@Delete('/:id')
	deleteUser(@Param('id') id: number): any {
		return this.userService.remove(id);
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
