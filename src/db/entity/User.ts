// @ts-nocheck
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm"
@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: number

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
    avatar?: string
}
