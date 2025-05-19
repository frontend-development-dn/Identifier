import {BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from 'bcrypt';
import {IEntity} from "../interfaces/IEntity";
import {Branch} from "./branch";

@Entity()
export class User implements IEntity {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ unique: true })
    public username: string;

    @Column()
    public password: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @ManyToMany(() => Branch, {onDelete: 'SET NULL' })
    @JoinTable({
        name: 'access'
    })
    public branchAccess: Branch[]


    public constructor(id: number, username: string, password: string, createdAt: Date, updatedAt: Date, branches: Branch[]) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.branchAccess = branches;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    public async validatePassword(passwordToCheck: string): Promise<boolean> {
        return await bcrypt.compare(passwordToCheck, this.password);
    }
}