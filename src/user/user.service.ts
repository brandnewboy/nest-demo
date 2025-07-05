import { Injectable } from '@nestjs/common';

const users = ['张三', '李四'];

@Injectable()
export class UserService {
	getUsers() {
		return {
			code: 0,
			data: users,
			msg: '请求用户列表成功',
		};
	}

	addUser(user: string) {
		users.push(user);
		return {
			code: 0,
			data: users,
			msg: '请求添加用户成功',
		};
	}
}
