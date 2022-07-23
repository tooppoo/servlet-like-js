import { IncomingMessage, ServerResponse } from 'http'
import * as path from "path"
import {Renderer} from "@servlet/renderer";
import {InternalServerError} from "@servlet/http-servlet";

export interface HttpRequest extends IncomingMessage {
    readonly params: {
        query: URLSearchParams
        data: object
    }

    readonly requestURL: URL

    readonly attributes: object

    setAttribute(name: string, value: unknown): void

    getRequestDispatcher(viewPath: string): RequestDispatcher
}
class RequestDispatcher {
    constructor(
        private readonly load: Promise<{ [key: string]: Renderer }>,
        private readonly rendererName: string
    ) {}

    async forward(req: HttpRequest, res: ServerResponse): Promise<void> {
        const rendererMap = await this.load
        const render = rendererMap[this.rendererName]

        if (render !== undefined) {
            res.end(render(req.attributes))
        } else {
            throw new InternalServerError(`not found renderer for ${this.rendererName}`)
        }
    }
}

export const applyHttpRequest = (url: URL) => (req: IncomingMessage): HttpRequest => {
    let data = {}
    req.on('data', chunk => {
        data = JSON.parse(chunk)
    })

    let attributes = {} as { [key: string]: unknown }

    return Object.assign(req, {
        params: {
            query: url.searchParams,
            get data() {
                return data
            },
        },
        requestURL: url,
        getRequestDispatcher(ref: string) {
            const [viewPath, name] = ref.split('#')
            const targetPath = path.resolve(__dirname, '..', '..', 'view', viewPath)

            return new RequestDispatcher(import(targetPath), name)
        },
        get attributes() {
            return attributes
        },
        setAttribute(name: string, value: unknown) {
            attributes[name] = value
        }
    })
}
