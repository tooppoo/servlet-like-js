import { IncomingMessage } from "http";

export class BaseError extends Error {
    constructor(message: string) {
        super(message);

        Object.defineProperty(this, 'name', {
            configurable: true,
            enumerable: false,
            value: this.constructor.name,
            writable: true,
        });

        Error.captureStackTrace(this, this.constructor);
    }
}

export abstract class ServletError extends BaseError {
    abstract readonly statusCode: number
}

export class NotFound extends ServletError {
    readonly statusCode = 404
}

export class InternalServerError extends ServletError {
    readonly statusCode = 500
}

export const errorFromRequest = (
    req: IncomingMessage,
    err: new (msg: string) => ServletError
) => new err(`${err.name} ${req.method} ${req.url}`)