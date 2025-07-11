import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { Logs } from '../logs/logs.entity';
import { CreateUserDto, QueryUserDto } from './dto';
import { UtilsService } from '../utils/utils.service';
import { Roles } from '../roles/roles.entity';
import { IReqPayloadUser } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ListDto } from '@common/dto/list.dto';

interface IQueryUserResDto {
	data: User[];
	total: number;
	page: number;
	limit: number;
}

@Injectable()
export class UserService {
	private readonly logger: LoggerService = new Logger(UserService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(Profile)
		private readonly profileRepository: Repository<Profile>,

		@InjectRepository(Logs)
		private readonly logsRepository: Repository<Logs>,

		@InjectRepository(Roles)
		private readonly roleRepository: Repository<Roles>,

		private readonly utils: UtilsService,

		private readonly jwtService: JwtService,
	) {}

	loginFindOne(username: string, password: string) {
		// 构建 SQL 语句示例：
		// SELECT username, password FROM user WHERE user.username = 'admin' AND user.password = '123456'
		return this.userRepository.findOne({
			select: {
				id: true,
				username: true,
				password: true,
			},
			where: {
				username,
				password,
			},
			relations: {
				roles: false,
				profile: false,
			},
		});
	}

	/**
	 * 由passport的LocalStrategy验证通过后(证明用户密码正确)，再调用这个方法
	 * 处理如：
	 * 	- 生成token
	 * 	- 记录登录日志
	 * 	......
	 */
	afterGuardLogin(user: IReqPayloadUser) {
		// 生成token
		const token = this.jwtService.sign(user);
		// TODO 对接redis，记录登录日志
		return {
			token,
			user,
		};
	}

	parseToken(token: string): IReqPayloadUser {
		return this.jwtService.verify(token.replace('Bearer ', ''));
	}

	async findOne(id: number) {
		// 构建 SQL 语句示例：
		// SELECT user.id, user.username FROM user WHERE user.id = 1
		const user = await this.userRepository.findOne({
			select: {
				id: true,
				username: true,
				roles: {
					id: true,
					name: true,
				},
				profile: {
					id: true,
					gender: true,
					photo: true,
					address: true,
				},
			},
			where: {
				id,
			},
			relations: {
				profile: true,
				roles: true,
			},
		});
		return user;
	}

	async findAll(query: QueryUserDto): Promise<ListDto<User>> {
		const { page = 1, limit = 10, username, role, gender } = query;
		const skip = (page - 1) * limit;
		/**
		 * @sql
		 * SELECT user.id, user.username
		 * FROM user
		 * LEFT JOIN profile ON user.id = profile.user_id
		 * LEFT JOIN user_roles roles on user.id = roles.user_id
		 * LEFT JOIN roles on roles.id = user_roles.role_id
		 * WHERE user.username LIKE %username% AND roles.id = role AND profile.gender = gender
		 * LIMIT skip, limit;
		 * 问题：
		 *	如果存在参数为空，where and后面的条件会被忽略
		 */
		const queryBuilder = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.profile', 'profile')
			.leftJoinAndSelect('user.roles', 'roles')
			.where('1=1');
		const processedQueryBuilder = this.utils.sqlCondition<User>(
			queryBuilder,
			{
				'user.username': {
					key: 'username',
					value: `%${username}%`,
					operator: 'LIKE',
				},
				'roles.id': role,
				'profile.gender': gender,
			},
		);

		const res = await processedQueryBuilder
			.take(limit)
			.skip(skip)
			.getMany();
		// 克隆查询构建器以获取总数量
		const countQueryBuilder = processedQueryBuilder.clone();
		// 移除选择字段，只计算数量
		countQueryBuilder
			.select('COUNT(DISTINCT user.id) as total')
			.setParameters(queryBuilder.getParameters());
		const [{ total }] = await countQueryBuilder.getRawMany();

		return new ListDto<User>({
			list: res,
			total,
			page,
			pageSize: limit,
		});
	}

	async create(user: CreateUserDto) {
		let roles: Roles[] = [];
		if (Array.isArray(user.roles)) {
			// TODO 查询需要的角色
			roles = await this.roleRepository
				.createQueryBuilder('roles')
				.select(['roles.id', 'roles.name'])
				.where('roles.id IN (:...roles)', { roles: user.roles })
				.getMany();
		}
		delete user.roles;
		const processedUserInfo = this.userRepository.merge(
			user as unknown as User,
			{
				roles,
			},
		);
		const userTmp = this.userRepository.create(processedUserInfo);
		return await this.userRepository.save(userTmp);
	}

	async remove(id: number) {
		// 构建 SQL 语句示例：
		// DELETE FROM user WHERE user.id = 1
		// return this.userRepository.delete(id);
		const user = await this.findOne(id);
		if (!user) {
			return {
				data: null,
				msg: 'user not found',
			};
		}
		const res = await this.userRepository.remove(user);
		return {
			data: res,
			msg: 'delete user success',
		};
	}

	async update(newUserDto: any, id: number) {
		// update方法只能修改单模型结构，不能对有(级联)关联关系的数据实体对应的表信息进行修改
		// const res = await this.userRepository.update(id, newUserDto);
		const oldUser = await this.findOne(id);
		const newUser = this.userRepository.merge(oldUser, newUserDto);
		const res = await this.userRepository.save(newUser);

		return res;
	}

	getProfile(userId: number) {
		// 构建 SQL 语句示例：
		// SELECT * FROM profile WHERE profile.user_id = 1
		return this.profileRepository.findOne({
			where: {
				user: {
					id: userId,
				},
			},
		});
	}

	getOperationLogs(userId: number) {
		// 构建 SQL 语句示例：
		// SELECT * FROM logs WHERE logs.user_id = 1
		return this.logsRepository.find({
			where: {
				user: {
					id: userId,
				},
			},
		});
	}

	getProfileById(profileId: number) {
		// 构建 SQL 语句示例：
		// SELECT * FROM profile WHERE profile.id = 1
		return this.profileRepository.findOne({
			where: {
				id: Number(profileId),
			},
		});
	}

	getLogsByGroup(userId: number) {
		/**
		 * @sql
		 * SELECT logs.result as result, COUNT("logs.result") AS count
		 * FROM logs
		 * WHERE logs.user_id = #{userId}
		 * GROUP BY logs.result
		 * ORDER BY logs.result, count DESC;
		 */
		return (
			this.logsRepository
				.createQueryBuilder('logs')
				.select('logs.result', 'result')
				// count 应该是number类型，但是typeorm会自动转换为string类型，所以需要手动转换
				.addSelect('COUNT("logs.result")', 'count')
				.where('logs.user_id = :userId', { userId })
				.groupBy('logs.result')
				.orderBy('logs.result', 'DESC')
				.addOrderBy('count', 'DESC')
				// .offset(2)
				// .limit(3)
				.getRawMany()
		);
	}
}
