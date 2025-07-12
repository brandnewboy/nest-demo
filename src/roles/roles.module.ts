import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@src/roles/entities/role.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Role])],
	controllers: [RolesController],
	providers: [RolesService],
})
export class RolesModule {}
