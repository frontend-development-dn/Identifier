import {PromiseResult} from "../types/promise-result";
import {IEntity} from "./IEntity";

export interface IAuthService<T extends IEntity> {
    authorize(username: string, password: string): PromiseResult<T | null>;
}