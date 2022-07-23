import { createServer, ServerResponse } from 'http'

import { readWebXml } from "@servlet/web"
import { Method, NotFound, ServletError } from "@servlet/http-servlet"
import {buildUrlFromRequest} from "@servlet/url";
import {applyHttpRequest} from "@servlet/request";

const port = 9090
const enc = 'utf-8'
const urlFromRequest = buildUrlFromRequest('http')

async function main() {
    const web = await readWebXml()

    const server = createServer(async (req, res) => {
        try {
            const url = urlFromRequest(req)

            req.setEncoding(enc)
            res.setHeader('Content-Type', `text/html;charset=${enc}`)

            const map = web.mappingDom.find(dom => dom.urlPattern === url.pathname)
            if (map === undefined) return handleError(new NotFound(`NotFound ${req.url}`), res)

            const servlet = web.servletDom.find(d => d.servletName === map.servletName)
            if (servlet === undefined) return handleError(new NotFound(`NotFound ${req.url}`), res)

            const servletInstance = await servlet.servletClass

            await servletInstance.handle(
                req.method as Method,
                applyHttpRequest(url)(req),
                res
            )
        } catch (error) {
            if (error instanceof Error) {
                handleError(error, res)
            }
            else {
                res.writeHead(500)
                res.end(`<h1>500 Unknown Error</h1>`)
            }
        }
    })

    server.listen(port)
}

function handleError(error: Error, res: ServerResponse) {
    const statusCode = error instanceof ServletError
        ? error.statusCode
        : 500

    res.writeHead(statusCode)
    res.end(`
            <h1>${statusCode} ${error.message}</h1>
            <h2>Stack Trace</h2>
            <div>
            ${
        (error.stack || '')
            .replace(/\n/g, '<br/>')
    }
            </div>
        `)
}


main().catch(error => {
    console.error(error)
})
