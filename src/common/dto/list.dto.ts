import { IsNumber, IsOptional } from 'class-validator';

export class ListDto<T> {
	page: number = 1;

	pageSize: number = 10;

	total: number;

	list: T[];

	constructor({
		page,
		pageSize,
		total,
		list,
	}: {
		page: number;
		pageSize: number;
		total: number;
		list: T[];
	}) {
		this.page = page;
		this.pageSize = pageSize;
		this.total = total;
		this.list = list;
	}
}

export class ListQueryDto {
	@IsOptional()
	@IsNumber({}, { message: 'page必须是数字' })
	page: number = 1;

	@IsOptional()
	@IsNumber({}, { message: 'pageSize必须是数字' })
	pageSize: number = 10;
}
