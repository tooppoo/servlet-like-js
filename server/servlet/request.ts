import { IncomingMessage, ServerResponse } from 'http'
import * as path from "path"

import {Renderer} from "@servlet/renderer";
import {InternalServerError} from "@servlet/error";

export interface HttpRequest extends IncomingMessage {
    readonly params: {
        query: URLSearchParams
        data: object
    }

    readonly attributes: object
    setAttribute(name: string, value: unknown): void

    getParameter(name: string): string | null

    getRequestDispatcher(viewPath: string): RequestDispatcher

    getContextPath(): string

    getRequestURI(): string
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

export const applyHttpRequest = (url: URL) => async (req: IncomingMessage): Promise<HttpRequest> => {
    const data = await new Promise<{ [key: string]: string }>((resolve) => {
        if (['POST', 'PUT', 'PATCH'].every(m => m !== req.method)) {
            resolve({})

            return
        }

        let data = {} as { [key: string]: string }

        req.on('data', chunk => {
            new URLSearchParams(chunk).forEach((val, key) => {
                data[key] = val
            })

            resolve(data)
        })
    })

    let attributes = {} as { [key: string]: unknown }

    return Object.assign(req, {
        params: {
            query: url.searchParams,
            get data() {
                return data
            },
        },
        getRequestDispatcher(ref: string) {
            const targetPath = path.resolve(
                __dirname,
                '..',
                '..',
                'view',
                ...ref.split('/')
            )

            return new RequestDispatcher(import(targetPath), 'default')
        },
        get attributes() {
            return attributes
        },
        setAttribute(name: string, value: unknown) {
            attributes[name] = value
        },
        getParameter(name: string): string | null {
            return this.params.data[name] || null
        },
        getContextPath(): string {
            return '' // context設定も使う場合は再実装
        },
        getRequestURI(): string {
            return url.pathname
        }
    })
}
