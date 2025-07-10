import { SetMetadata } from '@nestjs/common';

/**
 * 装饰的方法 或 类 被标记为 公开路由
 * 将不会被 JwtGuard 拦截
 */
export const IS_PUBLIC_ROUTE_KEY = Symbol('__is-public-route__');
export const IsPublicRoute = () =>
	SetMetadata<symbol, boolean>(IS_PUBLIC_ROUTE_KEY, true);
