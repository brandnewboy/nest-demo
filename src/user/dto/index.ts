import {
	IsArray,
	IsIn,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	Length,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
	@IsString()
	username: string;

	@IsString()
	@Length(6, 12)
	password: string;

	@IsArray()
	@IsOptional()
	roles?: number[];

	@IsObject()
	@ValidateNested()
	@Type(() => ProfileDto)
	@IsOptional()
	profile?: ProfileDto;
}
