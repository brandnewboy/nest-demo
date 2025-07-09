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
	UseGuards,
	Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, QueryUserDto } from './dto';
import { TypeormFilter } from '../common/filters/typeorm.filter';
import { LocalGuard } from '../common/guards/local.guard';
import { Request } from 'express';
import { IReqPayloadUser } from '../auth/auth.service';
import { IsPublicRoute } from '../common/decorators/is-public-route.decorator';

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
	async addUser(@Body() dto: CreateUserDto) {
		this.logger.log('add user: ' + JSON.stringify(dto));
		const res = await this.userService.create(dto);
		return {
			data: {
				username: res.username,
				id: res.id,
			},
			msg: 'create user success',
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

	@UseGuards(LocalGuard)
	@IsPublicRoute()
	@Post('/login')
	login(@Req() req: Request): any {
		const { user, token } = this.userService.afterGuardLogin(
			req.user as IReqPayloadUser,
		);
		return {
			data: {
				user,
			},
			access_token: token,
		};
	}
}
