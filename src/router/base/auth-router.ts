import {ISetup} from "../../interfaces/ISetup";
import {IAuthRouter} from "../../interfaces/IAuthRouter";
import { Router } from "express";
import {IEntity} from "../../interfaces/IEntity";
import {BaseService} from "../../services/base/base-service";
import {IAuthService} from "../../interfaces/IAuthService";
import {StatusCodes} from "http-status-codes";
import {IAuthPayload} from "../../interfaces/IAuthPayload";
import jwt from "jsonwebtoken";
import {generateError} from "../../dto/error/IError";
import {bodyCheck} from "../../middleware/body-check.middleware";

export class AuthRouter<TEntity extends IEntity, TService extends BaseService<TEntity> & IAuthService<TEntity>>
    implements IAuthRouter, ISetup {
    private readonly router: Router;
    private readonly service: TService;
    private readonly active: string[] = [];

    public constructor(service : TService) {
        this.router = Router();
        this.service = service;

        this.setup();
    }

    setup() {
        this.router.post("/Login", [bodyCheck('username'), bodyCheck('password')],this.login.bind(this));
        this.router.post("/Logout", this.logout.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    login(req: any, res: any) {
        const { username, password } = req.body;
        const validate = this.service.authorize(username, password);
        if(!validate) {
            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        }
        const payload: IAuthPayload = {
            userId: req.userId,
            username: username,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (15 * 60)
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET!);
        this.active.push(token);
        return res.json({ token });
    }

    logout(req: any, res: any) {
        const authHeader = req.headers.authorization;
        if(!authHeader || authHeader.startsWith("Bearer")) {
            return res.status(StatusCodes.BAD_REQUEST).json(generateError('Token has invalid syntax'))
        }
        const token = authHeader.split(' ')[1];
        const index = this.active.indexOf(token);
        if (index !== -1) {
            this.active.splice(index, 1);
            return res.sendStatus(StatusCodes.OK);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json(generateError('Token not found'));
        }
    }
}