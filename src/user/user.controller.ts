import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private config: ConfigService,
	) {}

	@Get()
	getUsers(): any {
		return this.userService.getUsers();
	}

	@Get('/config')
	getConfig() {
		return this.config.get('db.mysql2');
	}
}
