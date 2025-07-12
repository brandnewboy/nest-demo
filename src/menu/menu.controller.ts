import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { IsPublicRoute } from '@common/decorators/is-public-route.decorator';
import { ListQueryDto } from '@common/dto/list.dto';

@IsPublicRoute()
@Controller('menu')
export class MenuController {
	constructor(private readonly menuService: MenuService) {}

	@Post()
	create(@Body() createMenuDto: CreateMenuDto) {
		return this.menuService.create(createMenuDto);
	}

	@Get()
	findAll(@Query() query: ListQueryDto) {
		return this.menuService.findAll(query);
	}

	@Get('/info/:id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.menuService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateMenuDto: UpdateMenuDto,
	) {
		return this.menuService.update(id, updateMenuDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.menuService.remove(id);
	}
}
