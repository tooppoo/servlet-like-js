import { IncomingMessage, ServerResponse } from "http"

export type RequestDispatcher = (...args: any[]) => string

export function getRequestDispatcher<T extends RequestDispatcher>(
    dispatcher: T,
    attributes: Parameters<T>
) {
    return {
        forward(req: IncomingMessage, res: ServerResponse) {
            res.end(dispatcher(attributes))
        }
    }
}
