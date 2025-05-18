import {BaseService} from "./base/base-service";
import {User} from "../models/user";
import {Repository, SelectQueryBuilder} from "typeorm";
import {AppDataSource, generateSource} from "../config/app-source";
import {IAuthService} from "../interfaces/IAuthService";
import {PromiseResult} from "../types/promise-result";

export class UserService extends BaseService<User> implements IAuthService<User> {
    constructor() {
        super(generateSource(User));
    }

    public join(query: SelectQueryBuilder<User>): SelectQueryBuilder<User> {
        return query
            .leftJoinAndSelect('entity.branchAccess', 'branch');
    }

    public async authorize(username: string, password: string): Promise<User | null> {
        try {
            const user = await this.repository.findOne({
                where: { username }
            });
            if (!user) {
                return null;
            }
            const valid = await user.validatePassword(password);
            return valid ? user : null;
        } catch (error) {
            console.error('Authorization error:', error);
            return null;
        }
    }
}