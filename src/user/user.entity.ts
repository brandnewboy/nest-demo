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
import { Role } from '@src/roles/entities/role.entity';
import { Logger } from '@nestjs/common';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
	@Exclude()
	private logger = new Logger(User.name);

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	username: string;

	@Column()
	@Exclude()
	password: string;

	@OneToOne(() => Profile, profile => profile.user, {
		cascade: ['insert', 'update', 'remove'],
	})
	profile: Profile;

	@OneToMany(() => Logs, logs => logs.user)
	logs: Logs[];

	@ManyToMany(() => Role, role => role.users, {
		cascade: false,
	})
	@JoinTable({
		name: 'user_roles',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
	})
	roles: Role[];

	@BeforeRemove()
	beforeRemove() {
		this.logger.warn('user --> beforeRemove called');
	}

	@AfterRemove()
	afterRemove() {
		this.logger.warn('user --> afterRemove called');
	}
}
