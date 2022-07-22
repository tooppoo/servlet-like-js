import { IncomingMessage, ServerResponse } from 'http'

export abstract class HttpServlet {
    public doGet(req: IncomingMessage, res: ServerResponse) {
        throw errorFromRequest(req, Forbidden)
    }
    public doPost(req: IncomingMessage, res: ServerResponse) {
        throw errorFromRequest(req, Forbidden)
    }
    public doPut(req: IncomingMessage, res: ServerResponse) {
        throw errorFromRequest(req, Forbidden)
    }
    public doDelete(req: IncomingMessage, res: ServerResponse) {
        throw errorFromRequest(req, Forbidden)
    }
}

const errorFromRequest = (
    req: IncomingMessage,
    err: new (msg: string) => ServletError
) => new err(`${err.name} "${req.method} ${req.url}`)

export abstract class ServletError extends Error {
    abstract readonly statusCode: number

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

export class NotFound extends ServletError {
    readonly statusCode = 404
}
export class Forbidden extends ServletError {
    readonly statusCode = 403
}
