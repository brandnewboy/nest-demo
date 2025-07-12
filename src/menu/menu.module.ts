import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu } from './menu.entity';
import { Role } from '@src/roles/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([Menu, Role])], // 注册 Menu 和 Role 实体的存储库
	controllers: [MenuController],
	providers: [MenuService],
})
export class MenuModule {}
