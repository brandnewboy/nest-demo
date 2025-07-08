import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	OneToMany,
	ManyToMany,
	JoinTable,
	BeforeRemove,
	AfterRemove,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import { Logger } from '@nestjs/common';

@Entity()
export class User {
	private logger = new Logger(User.name);
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	// @Column()
	username: string;

	@Column()
	password: string;

	@OneToOne(() => Profile, profile => profile.user, {
		cascade: ['insert', 'update', 'remove'],
	})
	profile: Profile;

	@OneToMany(() => Logs, logs => logs.user)
	logs: Logs[];

	@ManyToMany(() => Roles, roles => roles.users, {
		cascade: ['insert', 'update'],
	})
	@JoinTable({
		name: 'user_roles',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
	})
	roles: Roles[];

	@BeforeRemove()
	beforeRemove() {
		this.logger.warn('user --> beforeRemove called');
	}

	@AfterRemove()
	afterRemove() {
		this.logger.warn('user --> afterRemove called');
	}
}
