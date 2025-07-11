import {
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE_KEY } from '../decorators/is-public-route.decorator';
import { ConfigEnum } from '../enum/config.enum';
import { UserService } from '@src/user/user.service';
export type IReqMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'DELETE'
	| 'PATCH'
	| 'OPTIONS'
	| 'HEAD'
	| 'get'
	| 'post'
	| 'put'
	| 'delete'
	| 'patch'
	| 'options'
	| 'head';
export interface IRoute {
	path: string;
	method: IReqMethod;
}

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	private readonly whiteList: IRoute[];

	constructor(
		private readonly config: ConfigService,
		private readonly reflector: Reflector,
		private readonly userService: UserService,
	) {
		super();
		this.whiteList = [].concat(
			this.config.get<IRoute[]>(ConfigEnum.ROUTES_WHITE_LIST) || [],
		);
	}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const ctx = context.switchToHttp();
		const request = ctx.getRequest<Request>();
		const token = request.headers.authorization;
		// TODO 白名单 - 配置文件
		// 1. @ISPublicRoute() 优先放行
		const isPublicRoute = this.reflector.get<boolean>(
			IS_PUBLIC_ROUTE_KEY,
			context.getHandler(),
		);
		if (isPublicRoute) {
			return true;
		}

		// 2. 再判断白名单列表
		const isInWhiteList = this.checkWhiteList(request);
		if (isInWhiteList) {
			return true;
		}

		if (!token) throw new UnauthorizedException('请登录');
		const atUserId = this.userService.parseToken(token);
		if (!atUserId) throw new ForbiddenException('token过期 请重新登录');

		return this.activate(context);
	}

	activate(ctx: ExecutionContext) {
		return super.canActivate(ctx);
	}

	checkWhiteList(request: Request) {
		const currentPath = request.path;
		const currentMethod = request.method as IReqMethod;

		return (
			this.whiteList.findIndex(route => {
				let path: string;
				const globalPrefix = request.baseUrl;
				const _path = route.path;
				if (route.path.startsWith('/')) {
					path = globalPrefix + _path;
				} else {
					path = globalPrefix + '/' + _path;
				}
				// TODO 处理 /user/info/:id 这种动态路径参数情况 将其抽离到utils中
				if (path.includes(':')) {
					const pathArr = path.split('/');
					const currentPathArr = currentPath.split('/');
					if (pathArr.length !== currentPathArr.length) {
						return false;
					}
					for (let i = 0; i < pathArr.length; i++) {
						if (pathArr[i].startsWith(':')) {
							pathArr[i] = currentPathArr[i];
						}
					}
					path = pathArr.join('/');
				}
				return (
					path === currentPath &&
					route.method.toUpperCase() === currentMethod.toUpperCase()
				);
			}) !== -1
		);
	}
}
