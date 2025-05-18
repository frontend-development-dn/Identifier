import {checkNumber} from "../utils/checkNumber";
import {StatusCodes} from "http-status-codes";

export function idCheck(req: any, res: any, next: Function) {
    const id = checkNumber(req.params.id);
    if(!id) {
        return res.status(StatusCodes.BAD_REQUEST)
    }
    next();
}