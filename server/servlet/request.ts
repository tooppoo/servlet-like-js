import { IncomingMessage } from 'http'

export interface HttpRequest extends IncomingMessage {
    readonly params: {
        query: URLSearchParams
        data: object
    }
}

export const applyHttpRequest = (url: URL) => (req: IncomingMessage): HttpRequest => {
    let data = {}
    req.on('data', chunk => {
        data = JSON.parse(chunk)
    })

    return Object.assign(req, {
        params: {
            query: url.searchParams,
            get data() {
                return data
            },
        },
    })
}
