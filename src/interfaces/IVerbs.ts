import {PromiseResult} from "../types/promise-result";

export interface IVerbs {
    get: (req: any, res: any) => PromiseResult<any>;
    getAll: (req: any, res: any) => PromiseResult<any>;
    create: (req: any, res: any) => PromiseResult<any>;
    update: (req: any, res: any) => PromiseResult<any>;
    delete: (req: any, res: any) => PromiseResult<any>;
}