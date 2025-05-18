import {IEntity} from "./IEntity";
import {FindOptionsWhere, UpdateResult} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {PromiseResult} from "../types/promise-result";

export interface IService<T extends IEntity> {
    get(id: number):  PromiseResult<T | null>;
    getAll(start: number, limit: number): PromiseResult<T[]>;
    find(where: FindOptionsWhere<T>, start?: number, limit?: number): PromiseResult<T[]>;
    count(where?: FindOptionsWhere<T>): PromiseResult<number>;
    create(entity: T): PromiseResult<T>;
    delete(id: number): PromiseResult<boolean>;
    update(id: number, entity: QueryDeepPartialEntity<T>): PromiseResult<UpdateResult>;
    exists(id: number): PromiseResult<boolean>;
}