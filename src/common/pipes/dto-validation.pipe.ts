import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * @description 自定义DTO验证管道
 */
@Injectable()
export class CustomDtoValidationPipe implements PipeTransform {
	async transform(value: any, { metatype }: ArgumentMetadata) {
		if (!metatype || !this.toValidate(metatype)) {
			return value;
		}

		const object = plainToInstance(metatype, value, {
			// 内置的ValidationPipe支持隐式类型转换，这是非常有用的，自定义的管道需要在此处开启
			enableImplicitConversion: true,
		});
		const errors = await validate(object);
		if (errors.length > 0) {
			const msg = Object.values(errors[0].constraints)[0];
			throw new BadRequestException(msg);
		}
		return value;
	}

	private toValidate(metatype: any): boolean {
		const types = [String, Boolean, Number, Array, Object];
		return !types.includes(metatype);
	}
}
