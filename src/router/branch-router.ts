import {BranchService} from "../services/branch-service";
import {BaseRouter} from "./base/base-router";

const service = new BranchService();
const router = new BaseRouter(service);

export default router.getRouter();