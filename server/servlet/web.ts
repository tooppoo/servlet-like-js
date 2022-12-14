import { readFile } from 'node:fs/promises'
import path from 'path'
import xpath from 'xpath'
import { DOMParser } from 'xmldom'

import {BaseError} from "./error";
import {HttpServlet} from "./http-servlet";
import {ClassLoader} from "@util/class";
import {encode} from "../const";

export interface WebXml {
    servletDom: ServletDom[]
    mappingDom: ServletMappingDom[]
}
export async function readWebXml(): Promise<WebXml> {
    const configPath = path.resolve(__dirname, '..', '..', 'config')

    const buf = await readFile(path.resolve(configPath, 'web.xml'))
    const xml = buf.toString(encode)

    const doc = new DOMParser().parseFromString(xml)

    const servletDom = xpath
        .select('/web-app/servlet', doc)
        .map(v => new ServletDom(v as Node))
    const mappingDom = xpath
        .select('/web-app/servlet-mapping', doc)
        .map(v => new ServletMappingDom(v as Node))

    return { servletDom, mappingDom }
}

class ServletDom {
    private static classLoader = new ClassLoader()

    public readonly servletName: string
    private readonly _servletClass: string

    constructor(node: Node) {
        this.servletName = extract('/servlet/servlet-name', node)
        this._servletClass = extract('/servlet/servlet-class', node)
    }

    get servletClass(): Promise<HttpServlet> {
        return ServletDom.classLoader
            .load(this._servletClass)
            .then(dc => dc.getDeclaredConstructor().newInstance<HttpServlet>())
    }
}
class ServletMappingDom {
    public readonly servletName: string
    public readonly urlPattern: string

    constructor(node: Node) {
        this.servletName = extract('/servlet-mapping/servlet-name', node)
        this.urlPattern = extract('/servlet-mapping/url-pattern', node)
    }
}

function extract(name: string, node: Node): string {
    const str = node.toString()
    const doc = new DOMParser().parseFromString(str)
    const target = xpath.select1(name, doc) as Node|undefined

    if (target !== undefined) {
        return target.textContent || ''
    } else {
        throw new WebXmlError(`${name} is required but not exist on ${node}`)
    }
}

class WebXmlError extends BaseError {}