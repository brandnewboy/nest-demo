import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		UserModule,
		PassportModule.register({
			defaultStrategy: 'local',
		}),
	],
	/**
	 * @description 该模块导入了PassportModule，并使用register方法注册了一个默认策略local。
	 * 其他验证策略需要导入在此处的providers中，PassportModule会自动注册这些策略。
	 */
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
