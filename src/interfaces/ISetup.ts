import {IRouter} from "./IRouter";

export interface ISetup extends IRouter {
    setup(authenticate: boolean): void;
}