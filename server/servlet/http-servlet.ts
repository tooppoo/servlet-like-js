import {errorFromRequest, NotFound} from "./error";
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
        throw errorFromRequest(req, NotFound)
    }
    protected async doPost(req: HttpRequest, res: HttpResponse): Promise<void> {
        throw errorFromRequest(req, NotFound)
    }
    protected async doPut(req: HttpRequest, res: HttpResponse): Promise<void> {
        throw errorFromRequest(req, NotFound)
    }
    protected async doDelete(req: HttpRequest, res: HttpResponse): Promise<void> {
        throw errorFromRequest(req, NotFound)
    }
}

