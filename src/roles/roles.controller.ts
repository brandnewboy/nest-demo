import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IsPublicRoute } from '@common/decorators/is-public-route.decorator';
import { QueryRolesDto } from '@src/roles/dto/query-roles.dto';

@IsPublicRoute()
@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post()
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.rolesService.create(createRoleDto);
	}

	@Get()
	async findAll(@Query() query: QueryRolesDto) {
		return await this.rolesService.findAll(query);
	}

	@Get('/info/:id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.rolesService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.rolesService.update(+id, updateRoleDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.rolesService.remove(id);
	}
}
