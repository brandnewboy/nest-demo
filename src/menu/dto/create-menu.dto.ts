import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateMenuDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	path: string;

	@IsNotEmpty()
	@IsString()
	component: string;

	@IsNotEmpty()
	@IsString()
	icon: string;

	@IsNotEmpty()
	@IsNumber()
	order: number;

	@IsNotEmpty()
	@IsNumber()
	acl: number;

	// 关联的角色 ID 数组
	@IsArray({ message: 'roleIds 必须是一个数组' })
	@IsNumber({}, { each: true, message: 'roleIds 数组中的每个元素必须是数字' })
	@IsOptional()
	roleIds: number[];
}
