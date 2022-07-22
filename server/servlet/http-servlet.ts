import { IncomingMessage, ServerResponse } from 'http'
import {BaseError} from "./error";

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

function httpMethod2ServletMethod<T extends Method>(method: T): `do${Capitalize<Lowercase<T>>}` {
    const [h, ...rest] = method
    const body = `${h.toUpperCase()}${rest.join('').toLowerCase()}` as Capitalize<Lowercase<T>>

    return `do${body}`
}

export abstract class HttpServlet {
    public handle(method: 'GET' | 'POST' | 'PUT' | 'DELETE', req: IncomingMessage, res: ServerResponse) {
        const target = httpMethod2ServletMethod(method)

        this[target](req, res)
    }

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

export abstract class ServletError extends BaseError {
    abstract readonly statusCode: number
}

export class NotFound extends ServletError {
    readonly statusCode = 404
}
export class Forbidden extends ServletError {
    readonly statusCode = 403
}
