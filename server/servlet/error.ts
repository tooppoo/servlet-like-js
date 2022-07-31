import { IncomingMessage } from "http";
import { branch } from "ceiocs"

export class BaseError extends Error {
    constructor(message?: string) {
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

export class ServletError extends BaseError {
    readonly statusCode: number = 500

    constructor(message?: string, cause?: Error | unknown) {
        super();

        const stringifyError = (detail: Error) => `${message} caused by ${detail.message}`

        this.message = branch
            .if<string>(cause === undefined, () => stringifyError(this))
            .elseif(cause instanceof Error, () => stringifyError(cause as Error))
            .else(`caused by ${JSON.stringify(cause)}`)
    }
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