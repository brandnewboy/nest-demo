import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { Logs } from '../logs/logs.entity';
import { QueryUserDto } from './dto/query-user.dto';
import { UtilsService } from '../utils/utils.service';

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

		private readonly utils: UtilsService,
	) {}

	async findAll(
		query: QueryUserDto,
	): Promise<{ data: User[]; total: number; page: number; limit: number }> {
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
			.select(['user.id', 'user.username'])
			.leftJoin('user.profile', 'profile')
			.addSelect([
				'profile.id',
				'profile.gender',
				'profile.photo',
				'profile.address',
			])
			.leftJoin('user.roles', 'roles')
			.addSelect(['roles.id', 'roles.name'])
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

		// const queryBuilder = this.userRepository
		// 	.createQueryBuilder('user')
		// 	.select(['user.id', 'user.username'])
		// 	.leftJoin('user.profile', 'profile')
		// 	.addSelect([
		// 		'profile.id',
		// 		'profile.gender',
		// 		'profile.photo',
		// 		'profile.address',
		// 	])
		// 	.leftJoin('user.roles', 'roles')
		// 	.addSelect(['roles.id', 'roles.name'])
		// 	.where('1=1')
		// 	.andWhere('user.username LIKE :username', {
		// 		username: `%${username || ''}%`,
		// 	});
		// if (role) {
		// 	queryBuilder.andWhere('roles.id = :role', {
		// 		role: Number(role),
		// 	});
		// }
		//
		// if (gender) {
		// 	queryBuilder.andWhere('profile.gender = :gender', {
		// 		gender: Number(gender),
		// 	});
		// }
		// const res = await queryBuilder.take(limit).skip(skip).getMany();

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

		return {
			data: res,
			total: Number(total),
			page,
			limit,
		};
	}

	getUserById(id: number) {
		// 构建 SQL 语句示例：
		// SELECT user.id, user.username FROM user WHERE user.id = 1
		return this.userRepository.findOne({
			where: {
				id,
			},
			select: {
				id: true,
				username: true,
			},
		});
	}

	getProfile(userId: number) {
		console.log('getProfile called userId: ', userId);
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
		console.log('getOperationLogs called userId: ', userId);
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
		console.log('getProfileById called id: ', profileId);
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
