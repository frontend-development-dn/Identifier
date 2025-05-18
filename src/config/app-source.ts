import "reflect-metadata";
import {DataSource, EntityTarget} from "typeorm";
import {User} from "../models/user";
import {IEntity} from "../interfaces/IEntity";
import {Branch} from "../models/branch";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [
        User,
        Branch
    ],
    migrations: [],
    subscribers: [],
});

export function generateSource<T extends IEntity>(entity: EntityTarget<T>) {
    return AppDataSource.getRepository<T>(entity);
}