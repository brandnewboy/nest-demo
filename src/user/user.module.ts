import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../common/enum/config.enum';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Profile, Logs, Roles]),
		JwtModule.registerAsync({
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>(ConfigEnum.TOKEN_SECRET),
				signOptions: {
					expiresIn: config.get<string>(ConfigEnum.TOKEN_EXPIRES_IN),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
