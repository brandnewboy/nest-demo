import {
	IsArray,
	IsIn,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	Length,
	ValidateNested,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { Role } from '@src/roles/entities/role.entity';

export class QueryUserDto {
	@IsNumber()
	@IsOptional()
	page?: number = 1;

	@IsNumber()
	@IsOptional()
	limit?: number = 10;

	@IsString()
	@IsOptional()
	username?: string;

	@IsNumber()
	@IsOptional()
	role?: number;

	@IsNumber()
	@IsOptional()
	gender?: number;
}

export class ProfileDto {
	@IsNumber()
	@IsIn([1, 0])
	gender?: number;

	@IsString()
	@IsOptional()
	photo?: string;

	@IsString()
	@IsOptional()
	address?: string;
}

export class CreateUserDto {
	@IsString({ message: '用户名必须是字符串' })
	@IsNotEmpty({ message: '用户名不能为空' })
	username: string;

	@IsString({ message: '密码必须是字符串' })
	@IsNotEmpty({ message: '密码不能为空' })
	@Length(6, 12, { message: '密码长度必须在6-12之间' })
	password: string;

	@IsArray({ message: '角色必须是id列表' })
	@IsOptional()
	roles?: number[];

	@IsObject()
	@ValidateNested()
	@Type(() => ProfileDto)
	@IsOptional()
	profile?: ProfileDto;
}

export class UpdateUserDto {
	@IsNumber()
	@IsOptional()
	id?: number;

	@IsString({ message: '用户名必须是字符串' })
	@Length(3, 20, { message: '用户名字符必须在3-20之间' })
	@IsOptional()
	username: string;

	@IsArray({ message: '角色必须是id列表' })
	@IsOptional()
	roles?: number[] | Role[];

	@IsObject()
	@ValidateNested()
	@Type(() => ProfileDto)
	@IsOptional()
	profile?: ProfileDto;
}

export class LoginReqDto {
	@IsString({ message: '用户名必须是字符串' })
	@IsNotEmpty({ message: '用户名不能为空' })
	username: string;

	@IsString({ message: '密码必须是字符串' })
	@IsNotEmpty({ message: '密码不能为空' })
	@Length(6, 12, { message: '密码长度必须在6-12之间' })
	@Exclude()
	password?: string;
}
export class LoginResDto extends LoginReqDto {
	access_token: string;
}
