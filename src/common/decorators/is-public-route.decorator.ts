import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROUTE_KEY = Symbol('__is-public-route__');
export const IsPublicRoute = () =>
	SetMetadata<symbol, boolean>(IS_PUBLIC_ROUTE_KEY, true);
