import {IRouter} from "./IRouter";

export interface ICombineRouter extends IRouter {
    combine(): void;
}