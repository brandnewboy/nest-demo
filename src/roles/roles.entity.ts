import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Menu } from '@src/menu/menu.entity';

@Entity()
export class Roles {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => User, user => user.roles, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	users: User[];

	@ManyToMany(() => Menu, menu => menu.roles)
	menus: Menu[];
}
