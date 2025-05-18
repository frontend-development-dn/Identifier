import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {IEntity} from "../interfaces/IEntity";
import {User} from "./user";

@Entity()
export class Branch implements IEntity {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column()
    public name: string;
    
    @ManyToMany(() => User, (user) => user.branchAccess)
    @JoinTable({
        name: 'access',
    })
    public users: User[]

    public constructor(id: number,
                       name: string,
                       users: User[]) {
        this.id = id;
        this.name = name;
        this.users = users;
    }
}