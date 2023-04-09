import { Column, Entity, OneToMany } from 'typeorm';
import Model from '../types';
import { Realty } from './Realty';

export type CreateUser = {
	name: string;
	email: string;
	password: string;
	secondName: string;
	bio?: string;
	city?: string;
	avatar?: string;
};

export type CreateUserWithCode = CreateUser & {
	code: string;
};

@Entity({ name: 'users' })
export class User extends Model {
	@Column({
		type: 'text',
		unique: true,
	})
	email: string;

	@Column({ length: 20 })
	name: string;

	@Column({ length: 20 })
	secondName: string;

	@Column('text')
	password: string;

	@Column({ length: 200 })
	bio?: string;

	@Column('text')
	city?: string;

	@Column('text')
	avatar?: string;

	@Column({
		array: true,
		type: 'int',
	})
	favorites: number[];

	@OneToMany(() => Realty, (realty) => realty.user)
	realties: Realty[];
}
