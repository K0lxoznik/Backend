// @ts-nocheck
import { Column } from 'typeorm';
import { Entity, PrimaryGeneratedColumn } from "typeorm"
enum Action { rent = 'rent', buy = 'buy' }
enum Type { apartment = 'apartment', room = 'room', studio = 'studio', cottage = 'cottage', hostel = 'hostel' }
enum Term { day = 'day', month = 'month' }
enum Currency { RUB = 'RUB', USD = 'USD', UAH = 'UAH' }
enum HouseType { brick = 'brick', panel = 'panel', monolith = 'monolith', wood = 'wood', other = 'other' }
enum Repair { design = 'design', euro = 'euro', dtk = 'dtk', without = 'without' }
@Entity({name: 'realties'})
export class Realty{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    action : Action
    
    @Column('text')
    type : Type

    @Column('text')
    title: string
    
    @Column({length: 400})
    description: string
    
    @Column('text')
    primeimage: string
    
    @Column('text', {array: true})
    images: string[]
    
    @Column('text')
    address: string
    
    @Column('int')
    rooms: number
    
    @Column('text')
    term: Term
    
    @Column('double precision')
    price:  number
    
    @Column('text')
    currency: Currency
    
    @Column('double precision')
    area: number
    
    @Column('int')
    floor:  number
    
    @Column('text')
    houseType: HouseType
    
    @Column('text')
    repair : Repair
    
    @Column('boolean')
    elevator : boolean
    
    @Column('text', {array: true})
    electricals : string[] 

    @Column('text')
    bedrooms : string
}