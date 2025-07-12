import { ListQueryDto } from '@common/dto/list.dto';
import { IsOptional, IsString } from 'class-validator';

export class QueryRolesDto extends ListQueryDto {
	@IsOptional()
	@IsString({ message: '角色名称必须是字符串' })
	roleName: string;
}
