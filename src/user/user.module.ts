import { Module, Logger } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { Logs } from '../logs/logs.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, Profile, Logs])],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
