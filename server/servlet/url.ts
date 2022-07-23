import {IncomingMessage} from "http";

type Protocol = 'http' | 'https'
export type UrlFromRequest = (req: IncomingMessage) => URL
export const buildUrlFromRequest = (protocol: Protocol): UrlFromRequest => (req) =>
    new URL(req.url || '/', `${protocol}://${req.headers.host}`)