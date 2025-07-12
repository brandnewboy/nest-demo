import { Injectable } from '@nestjs/common';
import {
	DeepPartial,
	FindOptionsWhere,
	Repository,
	SelectQueryBuilder,
} from 'typeorm';

interface ISqlCondition {
	key: string;
	rawValue: unknown;
	value: unknown;
	operator?: string;
}

@Injectable()
export class UtilsService {
	constructor() {}

	sqlCondition<T>(
		queryBuilder: SelectQueryBuilder<T>,
		conditions: Record<string, string | number | ISqlCondition>,
	): SelectQueryBuilder<T> {
		Object.keys(conditions).forEach(key => {
			if (conditions[key]) {
				if (typeof conditions[key] === 'object') {
					const {
						key: _k,
						rawValue,
						value,
						operator,
					} = conditions[key] as ISqlCondition;
					if (rawValue) {
						const v = value ? value : rawValue;
						queryBuilder.andWhere(`${key} ${operator} :${_k}`, {
							[_k]: v,
						});
					}
				} else {
					queryBuilder.andWhere(`${key} = :${key}`, {
						[key]: conditions[key],
					});
				}
			}
		});
		return queryBuilder;
	}

	async replaceUpdateInfo<T extends { id: number }>(
		repo: Repository<T>,
		id: number,
		updateInfo: DeepPartial<T>,
		processor?: (oldInfo: T, newInfo: T) => T,
	) {
		const oldInfo = await repo.findOne({
			where: { id } as FindOptionsWhere<T>,
		});
		let newInfo: T = null;
		if (oldInfo) {
			newInfo = repo.merge(oldInfo, updateInfo);
			if (processor) {
				newInfo = processor(oldInfo, newInfo);
			}
		}
		return newInfo;
	}
}
