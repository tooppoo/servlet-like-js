import { createServer, ServerResponse } from 'http'

import { readWebXml } from "@servlet/web"
import {buildUrlFromRequest} from "@servlet/url";
import {Router} from "@servlet/router";
import {ServletError} from "@servlet/error";
import {encode} from "./const";

const port = 9090
const enc = encode
const urlFromRequest = buildUrlFromRequest('http')

async function main() {
    const web = await readWebXml()
    const router = new Router(web, urlFromRequest)

    const server = createServer(async (req, res) => {
        try {
            req.setEncoding(enc)
            res.setHeader('Content-Type', `text/html;charset=${enc}`)

            await router.route(req, res)
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
    console.error(JSON.stringify(error, null, 2))

    const statusCode = error instanceof ServletError
        ? error.statusCode
        : 500

    res.writeHead(statusCode)
    res.end(`
            <h1>${statusCode} ${error.name}</h1>
            <div>
            ${(error.stack || '').replace(/\n/g, '<br/>')}
            </div>
        `)
}


main().catch(error => {
    console.error(error)
})
