import {WebXml} from "@servlet/web";
import {Method, NotFound} from "@servlet/http-servlet";
import {applyHttpRequest} from "@servlet/request";
import {IncomingMessage, ServerResponse } from "node:http";
import {UrlFromRequest} from "@servlet/url";

export class Router {
    constructor(
        private readonly webXml: WebXml,
        private readonly urlFromRequest: UrlFromRequest
    ) {}

    async route(req: IncomingMessage, res: ServerResponse): Promise<void> {
        const url = this.urlFromRequest(req)

        const map = this.webXml.mappingDom.find(dom => dom.urlPattern === url.pathname)
        if (map === undefined) throw new NotFound(`NotFound ${req.url}`)

        const servlet = this.webXml.servletDom.find(d => d.servletName === map.servletName)
        if (servlet === undefined) throw new NotFound(`NotFound ${req.url}`)

        const servletInstance = await servlet.servletClass

        return await servletInstance.handle(
            req.method as Method,
            applyHttpRequest(url)(req),
            res
        )
    }
}
