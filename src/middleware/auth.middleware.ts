import {NextFunction} from "express";
import jwt from 'jsonwebtoken';
import {generateError} from "../dto/error/IError";
import {IAuthPayload} from "../interfaces/IAuthPayload";
import {StatusCodes} from "http-status-codes";

export function auth(req: any, res: any, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json(generateError('Access denied. No token provided.'));
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(generateError('Internal server error'));
        }
        req.user = jwt.verify(token, secret) as IAuthPayload;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(StatusCodes.UNAUTHORIZED).json(generateError('Token expired'));
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(StatusCodes.FORBIDDEN).json(generateError('Invalid token'));
        }
        return res.status(StatusCodes.FORBIDDEN).json(generateError('Authentication failed'));
    }
}