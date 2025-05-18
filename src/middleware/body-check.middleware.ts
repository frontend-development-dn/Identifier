import {NextFunction} from "express";
import {StatusCodes} from "http-status-codes";
import {generateError} from "../dto/error/IError";

export function bodyCheck(textField: string) {
    return (req: any, res: any, next: NextFunction) => {
        if(!req.body[textField]) {
            return res.status(StatusCodes.BAD_REQUEST).json(generateError(`Field ${textField} is required`));
        }
        next();
    }
}