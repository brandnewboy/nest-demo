import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

export interface IReqPayloadUser {
	userId: number;
	username: string;
}

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	async validateUser(
		username: string,
		password: string,
	): Promise<IReqPayloadUser | null> {
		// TODO 密码加密
		const user = await this.userService.loginFindOne(username, password);

		if (user && user.password === password) {
			return {
				userId: user.id,
				username: user.username,
			};
		}
		return null;
	}
}
