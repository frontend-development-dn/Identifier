import {IVerbs} from "../../interfaces/IVerbs";
import {ISetup} from "../../interfaces/ISetup";
import {IEntity} from "../../interfaces/IEntity";
import {IService} from "../../interfaces/IService";
import {checkNumber} from "../../utils/checkNumber";
import {StatusCodes} from "http-status-codes";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {UpdateResult} from "typeorm";
import {Router} from "express";
import {idCheck} from "../../middleware/id.middleware";
import {generateError} from "../../dto/error/IError";
import {auth} from "../../middleware/auth.middleware";

export class BaseRouter<TEntity extends IEntity, TService
    extends IService<TEntity>>
    implements IVerbs, ISetup {

    public service: TService;
    public readonly router: Router;
    public constructor(service: TService, authenticate: boolean = true) {
        this.service = service;
        this.router = Router();
        this.setup(authenticate);
    }

    public getRouter(): Router {
        return this.router;
    }

    public setup(authenticate: boolean) {
        if(authenticate) {
            this.router.use(auth);
        }
        this.router.get("/", this.getAll.bind(this));
        this.router.get("/:id", [idCheck], this.get.bind(this));
        this.router.post("/", this.create.bind(this));
        this.router.patch("/:id", this.update.bind(this));
        this.router.delete("/:id", this.delete.bind(this));
    }

    public async get(req: any, res: any): Promise<any> {
        const id = parseInt(req.params.id);
        const entity: TEntity | null = await this.service.get(id);
        if (entity) {
            return res.status(StatusCodes.OK).json(entity);
        } else {
            return res.sendStatus(StatusCodes.NOT_FOUND);
        }
    }

    public async getAll(req: any, res: any): Promise<any> {
        const start = checkNumber(req.query.start, 0);
        const limit = checkNumber(req.query.limit, 10);
        const entities: TEntity[] = await this.service.getAll(start!, limit!);
        return res.status(StatusCodes.OK).json(entities);
    }

    public async create(req: any, res: any): Promise<any> {
        const newData: TEntity = req.body;
        const exists = await this.service.exists(newData.id);
        if(exists) {
            return res.status(StatusCodes.BAD_REQUEST).json(generateError("Entity already exists"));
        }
        const result: TEntity = await this.service.create(newData);
        return res.status(StatusCodes.CREATED).json(result);
    }

    public async update(req: any, res: any): Promise<any> {
        const id = parseInt(req.params.id);
        const newData: QueryDeepPartialEntity<TEntity> = req.body;
        const result: UpdateResult | null = await this.service.update(id, newData);
        if (result && result.affected === 1) {
            return res.status(StatusCodes.OK).json(result);
        } else {
            return res.sendStatus(StatusCodes.NOT_FOUND);
        }
    }

    public async delete(req: any, res: any): Promise<any> {
        const id = parseInt(req.params.id);
        const result: boolean = await this.service.delete(id);
        if (result) {
            return res.status(StatusCodes.OK).json(result);
        } else {
            return res.sendStatus(StatusCodes.NOT_FOUND);
        }
    }
}