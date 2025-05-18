import {AuthRouter} from "./base/auth-router";
import {UserService} from "../services/user-service";

const authService = new UserService();
const authRouter = new AuthRouter(authService);

export const clientAuthRouter = authRouter.getRouter();