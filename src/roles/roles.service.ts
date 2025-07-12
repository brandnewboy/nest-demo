import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeepPartial, Repository } from 'typeorm';
import { Role } from '@src/roles/entities/role.entity';
import { Result } from '@common/dto/result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from '@src/utils/utils.service';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		private readonly utils: UtilsService,
	) {}

	async create(createRoleDto: CreateRoleDto) {
		return Result.ok(
			await this.roleRepository.save(
				this.roleRepository.create(createRoleDto),
			),
		);
	}

	async findAll(roleName: string) {
		console.log(typeof roleName);
		let res: Role[] = [];
		const queryBuilder = this.roleRepository
			.createQueryBuilder('roles')
			.where('1=1');
		res = await this.utils
			.sqlCondition(queryBuilder, {
				'roles.name': {
					key: 'name',
					rawValue: roleName,
					value: `%${roleName}%`,
					operator: 'LIKE',
				},
			})
			.getMany();

		return Result.ok('获取角色列表成功', res);
	}

	async findOne(id: number) {
		return Result.ok(await this.roleRepository.findOne({ where: { id } }));
	}

	async update(id: number, updateRoleDto: UpdateRoleDto) {
		if (!id) {
			return Result.fail(HttpStatus.BAD_REQUEST, '角色id不能为空');
		}
		const newInfo = await this.utils.replaceUpdateInfo(
			this.roleRepository,
			id,
			updateRoleDto as DeepPartial<Role>,
		);
		if (!newInfo) {
			return Result.fail(HttpStatus.BAD_REQUEST, '角色不存在');
		}
		return Result.ok(
			'修改角色成功',
			await this.roleRepository.save(newInfo),
		);
	}

	async remove(id: number) {
		const role = await this.roleRepository.findOne({ where: { id } });
		if (!role) {
			return Result.fail(HttpStatus.BAD_REQUEST, '角色不存在');
		}
		return Result.ok(await this.roleRepository.remove(role));
	}
}
