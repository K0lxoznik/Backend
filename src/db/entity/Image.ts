import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Realty } from './Realty';

@Entity({ name: 'images' })
export class Image {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'bytea' })
	data: Buffer;

	@ManyToOne(() => Realty, (realty) => realty.images)
	@JoinColumn()
	realty?: Realty;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
