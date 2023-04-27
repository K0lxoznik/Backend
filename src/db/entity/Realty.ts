import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Model from '../types';
import { Image } from './Image';
import { User } from './User';

enum Action {
	RENT = 'rent',
	BUY = 'buy',
}

enum Type {
	apartment = 'apartment',
	room = 'room',
	studio = 'studio',
	cottage = 'cottage',
	hostel = 'hostel',
	house = 'house',
}

enum Term {
	day = 'day',
	month = 'month',
	forever = 'forever',
}

enum Currency {
	RUB = 'RUB',
	USD = 'USD',
}

enum HouseType {
	brick = 'brick',
	panel = 'panel',
	monolith = 'monolith',
	wood = 'wood',
	other = 'other',
}

enum Repair {
	design = 'design',
	euro = 'euro',
	cosmetic = 'cosmetic',
	without = 'without',
}

@Entity({ name: 'realties' })
export class Realty extends Model {
	@Column({
		type: 'enum',
		enum: Action,
	})
	action: string;

	@Column({
		type: 'enum',
		enum: Type,
	})
	type: string;

	@Column({
		type: 'enum',
		enum: Term,
	})
	term: string;

	@Column({
		type: 'enum',
		enum: HouseType,
	})
	houseType: string;

	@Column({
		type: 'enum',
		enum: Repair,
	})
	repair: string;

	@Column({
		type: 'enum',
		enum: Currency,
		default: Currency.RUB,
	})
	currency: string;

	@Column({ length: 100 })
	title: string;

	@Column({ length: 2500 })
	description: string;

	@Column('text')
	address: string;

	@Column('int')
	rooms: number;

	@Column('double precision')
	price: number;

	@Column('double precision')
	area: number;

	@Column({
		type: 'int',
		default: 1,
	})
	views: number;

	@Column('int')
	floor: number;

	@Column('boolean')
	elevator: boolean;

	@Column('boolean')
	mortgage: boolean;

	@Column('int')
	bedrooms: number;

	@OneToMany(() => Image, (image) => image.realty)
	images: Image[];

	@ManyToOne(() => User, (user) => user.realties)
	@JoinColumn()
	user: User;
}
