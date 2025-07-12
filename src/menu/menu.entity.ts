import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '@src/roles/entities/role.entity';

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

	@ManyToMany(() => Role, roles => roles.menus, { cascade: true })
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
	roles: Role[];
}
