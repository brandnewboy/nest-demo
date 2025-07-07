import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@OneToOne(() => Profile, profile => profile.user)
	profile: Profile;

	@OneToMany(() => Logs, logs => logs.user)
	logs: Logs[];

	@ManyToMany(() => Roles, roles => roles.users)
	@JoinTable({
		name: 'user_roles',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
	})
	roles: Roles[];
}
