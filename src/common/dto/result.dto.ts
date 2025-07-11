/**
 * 统一响应对象泛型类
 * @template T - 响应数据的类型
 */
export class Result<T> {
	/**
	 * 响应状态码
	 */
	code: number;

	/**
	 * 响应消息
	 */
	message: string;

	/**
	 * 响应数据
	 */
	data: T;

	public constructor(code: number, message: string);
	public constructor(code: number, message: string, data: T);
	public constructor(code: number, message: string, data?: T) {
		this.code = code;
		this.message = message;
		if (data !== undefined) {
			this.data = data;
		}
	}

	/**
	 * 成功响应的静态工厂方法
	 * 重载签名 1: 只提供数据，使用默认消息
	 * @param data - 响应数据
	 * @returns 成功响应对象
	 */
	static success<T>(data: T): Result<T>;
	/**
	 * 成功响应的静态工厂方法
	 * 重载签名 2: 提供消息和数据
	 * @param message - 响应消息
	 * @param data - 响应数据
	 * @returns 成功响应对象
	 */
	static success<T>(message: string, data: T): Result<T>;
	/**
	 * 成功响应的静态工厂方法
	 * 重载签名 3: 只提供消息，无数据
	 * @param message - 响应消息
	 * @returns 成功响应对象
	 */
	static success(message: string): Result<undefined>;
	/**
	 * 成功响应的静态工厂方法实现
	 * @param messageOrData - 响应消息或响应数据
	 * @param data - 响应数据（可选）
	 * @returns 成功响应对象
	 */
	static success<T>(
		messageOrData?: string | T,
		data?: T,
	): Result<T | undefined> {
		if (typeof messageOrData === 'string' && data !== undefined) {
			// 消息和数据都传递了
			return new Result(200, messageOrData, data);
		} else if (
			typeof messageOrData !== 'string' &&
			messageOrData !== undefined
		) {
			// 只传递数据
			return new Result(200, '操作成功', messageOrData);
		} else if (typeof messageOrData === 'string' && data === undefined) {
			// 只传递消息
			return new Result(200, messageOrData);
		} else {
			// 既没有传递消息也没有传递数据
			return new Result(200, '操作成功');
		}
	}

	/**
	 * 失败响应的静态工厂方法
	 * @param code - 响应状态码，默认为 500
	 * @param message - 响应消息，默认为 '操作失败'
	 * @param data - 响应数据，默认为 null
	 * @returns 失败响应对象
	 */
	static fail<T>(code = 500, message = '操作失败', data?: T): Result<T> {
		if (!data) return new Result(code, message);
		return new Result(code, message, data);
	}
}
