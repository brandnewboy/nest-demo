import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Profile {
	@Exclude()
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	gender: number;

	@Column()
	photo: string;

	@Column()
	address: string;

	@OneToOne(() => User, user => user.profile, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user: User;
}
