import {WebXml} from "@servlet/web";
import {Method} from "@servlet/http-servlet";
import {applyHttpRequest} from "@servlet/request";
import {IncomingMessage, ServerResponse } from "node:http";
import {UrlFromRequest} from "@servlet/url";
import {applyHttpResponse} from "@servlet/response";
import {errorFromRequest, NotFound} from "@servlet/error";

import UrlPattern from "url-pattern";

export class Router {
    constructor(
        private readonly webXml: WebXml,
        private readonly urlFromRequest: UrlFromRequest
    ) {}

    async route(req: IncomingMessage, res: ServerResponse): Promise<void> {
        const url = this.urlFromRequest(req)

        const map = this.webXml.mappingDom.find(dom => {
            const urlPattern = new UrlPattern(dom.urlPattern)

            return urlPattern.match(url.pathname) !== null
        })
        if (map === undefined) throw errorFromRequest(req, NotFound)

        const servlet = this.webXml.servletDom.find(d => d.servletName === map.servletName)
        if (servlet === undefined) throw errorFromRequest(req, NotFound)

        const servletInstance = await servlet.servletClass

        await servletInstance.init()

        return await servletInstance.handle(
            req.method as Method,
            await applyHttpRequest(url)(req),
            applyHttpResponse(res)
        )
    }
}
