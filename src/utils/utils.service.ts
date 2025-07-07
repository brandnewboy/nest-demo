import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

interface ISqlCondition {
	key: string;
	value: unknown;
	operator?: string;
}

@Injectable()
export class UtilsService {
	constructor() {}

	sqlCondition<T>(
		queryBuilder: SelectQueryBuilder<T>,
		conditions: Record<string, unknown | ISqlCondition>,
	): SelectQueryBuilder<T> {
		Object.keys(conditions).forEach(key => {
			if (conditions[key]) {
				if (typeof conditions[key] === 'object') {
					const {
						key: _k,
						value,
						operator,
					} = conditions[key] as ISqlCondition;
					queryBuilder.andWhere(`${key} ${operator} :${_k}`, {
						[_k]: value,
					});
				} else {
					queryBuilder.andWhere(`${key} = :${key}`, {
						[key]: conditions[key],
					});
				}
			}
		});
		return queryBuilder;
	}
}
