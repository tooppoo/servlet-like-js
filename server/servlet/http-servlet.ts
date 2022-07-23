import {BaseError} from "./error";
import {HttpRequest} from "@servlet/request";
import {HttpResponse} from "@servlet/response";

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

function httpMethod2ServletMethod<T extends Method>(method: T): `do${Capitalize<Lowercase<T>>}` {
    const [h, ...rest] = method
    const body = `${h.toUpperCase()}${rest.join('').toLowerCase()}` as Capitalize<Lowercase<T>>

    return `do${body}`
}

export abstract class HttpServlet {
    public handle(method: 'GET' | 'POST' | 'PUT' | 'DELETE', req: HttpRequest, res: HttpResponse): Promise<void> {
        const target = httpMethod2ServletMethod(method)

        return this[target](req, res)
    }

    protected async doGet(req: HttpRequest, res: HttpResponse): Promise<void> {
        throw errorFromRequest(req, Forbidden)
    }
    protected async doPost(req: HttpRequest, res: HttpResponse): Promise<void> {
        throw errorFromRequest(req, Forbidden)
    }
    protected async doPut(req: HttpRequest, res: HttpResponse): Promise<void> {
        throw errorFromRequest(req, Forbidden)
    }
    protected async doDelete(req: HttpRequest, res: HttpResponse): Promise<void> {
        throw errorFromRequest(req, Forbidden)
    }
}

const errorFromRequest = (
    req: HttpRequest,
    err: new (msg: string) => ServletError
) => new err(`${err.name} ${req.method} ${req.url}`)

export abstract class ServletError extends BaseError {
    abstract readonly statusCode: number
}

export class NotFound extends ServletError {
    readonly statusCode = 404
}
export class Forbidden extends ServletError {
    readonly statusCode = 403
}

export class InternalServerError extends ServletError {
    readonly statusCode = 500
}
