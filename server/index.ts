import { branch } from "ceiocs"
import { createServer, ServerResponse } from 'http'
import parseUrl from 'parseurl'

import { readWebXml } from "@servlet/web"
import { Method, NotFound, ServletError } from "@servlet/http-servlet"

const port = 9090

async function main() {
    const web = await readWebXml()

    const server = createServer(async (req, res) => {
        try {
            const url = parseUrl(req)
            if (url === undefined) return

            res.setHeader('Content-Type', "text/html;charset=utf-8")

            const map = web.mappingDom.find(dom => dom.urlPattern === url.path)
            if (map === undefined) return handleError(new NotFound(`NotFound ${req.url}`), res)

            const servlet = web.servletDom.find(d => d.servletName === map.servletName)
            if (servlet === undefined) return handleError(new NotFound(`NotFound ${req.url}`), res)

            const servletInstance = await servlet.servletClass
            servletInstance.handle(req.method as Method, req, res)
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
    const statusCode = branch
        .if<number>(error instanceof ServletError, (error as ServletError).statusCode)
        .else(500)

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
