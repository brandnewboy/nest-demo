import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { Logs } from '../logs/logs.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(Profile)
		private readonly profileRepository: Repository<Profile>,

		@InjectRepository(Logs)
		private readonly logsRepository: Repository<Logs>,
	) {}

	getUsers() {
		return this.userRepository.find({
			select: {
				id: true,
				username: true,
			},
		});
	}

	getUserById(id: number) {
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
