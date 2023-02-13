// @ts-nocheck
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Realty } from './Realty';

export interface IUser {
    id: string;
    name: string;
    secondName: string;
    email: string;
    password: string;
    bio?: string;
    avatar?: string;
    city?: string;
    realties: Realty[];
}

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({length: 20})
    name: string

    @Column({length: 20})
    secondName: string
    
    @Column('text', {unique: true})
    email: string

    @Column('text')
    password: string 

    @Column({length: 200})
    bio?: string

    @Column('text')
    city?: string;

    @Column('text')
    avatar?: string

    @OneToMany(() => Realty, realty => realty.user)
    realties: Realty[];
}
