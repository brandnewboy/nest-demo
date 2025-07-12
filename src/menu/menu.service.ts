import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';
import { Role } from '@src/roles/entities/role.entity';
import { Result } from '@common/dto/result.dto';
import { ListDto, ListQueryDto } from '@common/dto/list.dto';

@Injectable()
export class MenuService {
	constructor(
		@InjectRepository(Menu)
		private readonly menuRepository: Repository<Menu>,
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
	) {}

	async create(createMenuDto: CreateMenuDto) {
		const { roleIds, ...menuData } = createMenuDto;
		let roles: Role[] = [];
		if (roleIds && roleIds.length > 0) {
			roles = await this.roleRepository
				.createQueryBuilder('role')
				.where('role.id IN (:...roleIds)', { roleIds })
				.getMany();
		}

		const menu = this.menuRepository.create({
			...menuData,
			roles,
		});

		return Result.ok(await this.menuRepository.save(menu));
	}

	async findAll(listDto: ListQueryDto) {
		const { page = 1, pageSize = 10 } = listDto;
		const skip = (page - 1) * pageSize;

		const [menus, total] = await this.menuRepository.findAndCount({
			relations: ['roles'],
			skip,
			take: pageSize,
		});

		const resultData = {
			list: menus,
			total,
			page,
			pageSize,
		};

		return Result.ok('获取菜单列表成功', new ListDto(resultData));
	}

	async findOne(id: number) {
		const menu = await this.menuRepository.findOne({
			where: { id },
			relations: ['roles'],
		});

		if (!menu) {
			return Result.fail(HttpStatus.BAD_REQUEST, '菜单不存在');
		}

		return Result.ok(menu);
	}

	async update(id: number, updateMenuDto: UpdateMenuDto) {
		const menu = await this.menuRepository.findOne({
			where: { id },
			relations: ['roles'],
		});

		if (!menu) {
			return Result.fail(HttpStatus.BAD_REQUEST, '菜单不存在');
		}

		const { roleIds, ...menuData } = updateMenuDto;
		let roles: Role[] = [];

		if (roleIds && roleIds.length > 0) {
			roles = await this.roleRepository
				.createQueryBuilder('role')
				.where('role.id IN (:...roleIds)', { roleIds })
				.getMany();
		}

		this.menuRepository.merge(menu, menuData);
		menu.roles = roles;

		return Result.ok('修改菜单成功', await this.menuRepository.save(menu));
	}

	async remove(id: number) {
		const menu = await this.menuRepository.findOne({ where: { id } });

		if (!menu) {
			return Result.fail(HttpStatus.BAD_REQUEST, '菜单不存在');
		}

		await this.menuRepository.remove(menu);
		return Result.ok('删除菜单成功');
	}
}
