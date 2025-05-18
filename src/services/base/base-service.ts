import {IEntity} from "../../interfaces/IEntity";
import {IService} from "../../interfaces/IService";
import {FindManyOptions, FindOptionsWhere, Repository, SelectQueryBuilder, UpdateResult} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

export class BaseService<T extends IEntity> implements IService<T> {
    protected repository: Repository<T>;

    protected constructor(repository: Repository<T>) {
        this.repository = repository;
    }

    protected join(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
        return query;
    }

    public async exists(id: number): Promise<boolean> {
        return await this.repository.existsBy({ id } as FindOptionsWhere<T>);
    }

    public async get(id: number): Promise<T | null> {
        const query = this.repository.createQueryBuilder("entity")
            .where("entity.id = :id", { id });

        const finalQuery = this.join(query);

        return await finalQuery.getOne();
    }

    public async getAll(start: number, limit: number): Promise<T[]> {
        const query = this.repository.createQueryBuilder("entity")
            .skip(start)
            .take(limit);

        const finalQuery = this.join(query);

        return await finalQuery.getMany();
    }

    public async find(where: FindOptionsWhere<T>, start?: number, limit?: number): Promise<T[]> {
        const query = this.repository.createQueryBuilder("entity");

        if (where) {
            Object.entries(where).forEach(([key, value]) => {
                query.andWhere(`entity.${key} = :${key}`, { [key]: value });
            });
        }

        if (start !== undefined) {
            query.skip(start);
        }

        if (limit !== undefined) {
            query.take(limit);
        }
        const finalQuery = this.join(query);

        return await finalQuery.getMany();
    }

    public async count(where?: FindOptionsWhere<T>): Promise<number> {
        const query = this.repository.createQueryBuilder("entity");
        if (where) {
            Object.entries(where).forEach(([key, value]) => {
                query.andWhere(`entity.${key} = :${key}`, { [key]: value });
            });
        }
        const finalQuery = this.join(query);

        return await finalQuery.getCount();
    }

    public async create(entity: T): Promise<T> {
        return await this.repository.save(entity);
    }

    public async update(id: number, entity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
        return await this.repository.update(id, entity);
    }

    public async delete(id: number): Promise<boolean> {
        return await this.repository.delete(id).then((result) => result.affected !== 0);
    }
}