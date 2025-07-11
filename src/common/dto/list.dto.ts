import { Expose } from 'class-transformer';

export class ListDto<T> {
	@Expose()
	page: number;

	@Expose()
	pageSize: number;

	@Expose()
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
