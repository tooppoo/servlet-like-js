import { ServerResponse } from "node:http";

export interface HttpResponse extends ServerResponse {
    sendRedirect(path: string): void
}

export function applyHttpResponse(res: ServerResponse): HttpResponse {
    return Object.assign(res, {
        sendRedirect(path: string) {
            res.writeHead(302, {
                Location: path,
            })
            res.end()
        }
    })
}
