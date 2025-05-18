import {BaseRouter} from "./base/base-router";
import {UserService} from "../services/user-service";
import {User} from "../models/user";

const service: UserService = new UserService();
const baseRouter = new BaseRouter<User, UserService>(service);

export default baseRouter.getRouter();