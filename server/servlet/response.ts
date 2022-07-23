import { ServerResponse } from "node:http";
import {ServletError} from "@servlet/error";

export interface HttpResponse extends ServerResponse {
    sendRedirect(path: string): void

    sendError(errorType: new (message: string) => ServletError): void
}

export function applyHttpResponse(res: ServerResponse): HttpResponse {
    return Object.assign(res, {
        sendRedirect(path: string) {
            res.writeHead(302, {
                Location: path,
            })
            res.end()
        },
        sendError(errorType: new (msg?: string) => ServletError): void {
            const error = new errorType()

            res.writeHead(error.statusCode)
            res.end(`
                <h1>${error.statusCode} ${error.name}</h1>
                <div>
                    ${error.stack}
                </div>
            `)
        }
    })
}
