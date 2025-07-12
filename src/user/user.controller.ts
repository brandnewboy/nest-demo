import {
	Body,
	Controller,
	Delete,
	Get,
	Query,
	Param,
	Patch,
	Post,
	UseGuards,
	Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginResDto, QueryUserDto, UpdateUserDto } from './dto';
import { LocalGuard } from '@common/guards/local.guard';
import { Request } from 'express';
import { IReqPayloadUser } from '../auth/auth.service';
import { IsPublicRoute } from '@common/decorators/is-public-route.decorator';
import { Result } from '@common/dto/result.dto';
import { User } from '@src/user/user.entity';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('')
	async getUsers(@Query() query: QueryUserDto) {
		const res = await this.userService.findAll(query);
		return Result.ok(res);
	}

	@Get('info/:id')
	async getUserById(@Param('id') id: number) {
		const res = await this.userService.findOne(id);
		return Result.ok(res);
	}

	@Post('')
	async addUser(@Body() dto: CreateUserDto) {
		const res = await this.userService.create(dto);
		return Result.ok('添加用户成功', res);
	}

	@Patch('/:id')
	async updateUser(
		@Body() dto: UpdateUserDto,
		@Param('id') id: number,
		@Req() request: Request,
	) {
		let res: any;
		const userInfo = request.user as IReqPayloadUser;
		const currentUpdateUserId = dto.id;
		//	TODO 使用redis缓存 用户信息 - 避免频繁查询数据库
		// if (userInfo.userId !== currentUpdateUserId) {
		// 	res = null;
		// 	// TODO 用户 - 接口 权限
		// 	return Result.fail(
		// 		HttpStatus.FORBIDDEN,
		// 		'您没有权限更新该用户信息',
		// 	);
		// }
		return Result.ok(
			'更新用户信息成功',
			await this.userService.update(dto as Partial<User>, id),
		);
	}

	@Delete('/:id')
	async deleteUser(@Param('id') id: number) {
		return Result.ok('删除用户成功', await this.userService.remove(id));
	}

	@Get('/profile/:id')
	getProfile() {
		return 'get profile';
	}

	@UseGuards(LocalGuard)
	@IsPublicRoute()
	@Post('/login')
	login(@Req() req: Request): any {
		const { user, token } = this.userService.afterGuardLogin(
			req.user as IReqPayloadUser,
		);
		return Result.ok<LoginResDto>('登录成功', {
			username: user.username,
			access_token: token,
		});
	}
}
