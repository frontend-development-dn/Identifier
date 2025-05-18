export interface IError {
    error: string;
}

export function generateError(message: string): IError {
    return {
        error: message
    };
}