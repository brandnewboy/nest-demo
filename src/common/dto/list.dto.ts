export class ListDto<T> {
	page: number;

	pageSize: number;

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
