import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from '@src/roles/roles.entity';

@Entity()
export class Menu {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	path: string;

	@Column()
	component: string;

	@Column()
	icon: string;

	@Column()
	order: number;

	@Column()
	acl: number;

	@ManyToMany(() => Roles, roles => roles.menus)
	@JoinTable({
		name: 'role_menus',
		joinColumn: {
			name: 'menu_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'role_id',
			referencedColumnName: 'id',
		},
	})
	roles: Roles[];
}
