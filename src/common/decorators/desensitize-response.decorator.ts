import { SetMetadata } from '@nestjs/common';

export const RESPONSE_TYPE_KEY = Symbol('__response_type__');

/**
 * 为控制器或路由处理方法附加响应数据类型元信息的装饰器
 * 与之对应的拦截器为 ResponseSerializerInterceptor
 * @param type 响应数据的类型
 */
export const DesensitizeResponse = <T>(type: new (...args: any[]) => T) =>
	SetMetadata(RESPONSE_TYPE_KEY, type);
