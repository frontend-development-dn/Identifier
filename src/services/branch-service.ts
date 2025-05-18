import {BaseService} from "./base/base-service";
import {Branch} from "../models/branch";
import {generateSource} from "../config/app-source";
import {SelectQueryBuilder} from "typeorm";

export class BranchService extends BaseService<Branch> {
    constructor() {
        super(generateSource(Branch));
    }

    public join(query: SelectQueryBuilder<Branch>): SelectQueryBuilder<Branch> {
        return query
            .leftJoinAndSelect('entity.users', 'user');
    }
}