import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '@common/enum/config.enum';
import { IReqPayloadUser } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly config: ConfigService) {
		super({
			// 从请求头的Authorization字段中提取token，格式为Bearer <token>
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get<string>(ConfigEnum.TOKEN_SECRET),
		});
	}

	async validate(payload: IReqPayloadUser) {
		/*TODO*
		 * 到此说明token验证通过，将payload中的用户信息返回给请求对象，
		 * 后续的请求处理可以直接使用req.user获取用户信息
		 * 在这里可以再做一些校验和附加处理
		 */
		return { userId: payload.userId, username: payload.username };
	}
}
