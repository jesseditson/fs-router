import { IncomingMessage, ServerResponse } from 'http'

declare function fsrouter(routesDir: string, config?: {
    filter?: (f: string) => boolean;
    ext?: string[];
}): (req: IncomingMessage) => fsrouter.RequestHandler | void

export = fsrouter
export as namespace fsrouter

declare namespace fsrouter {
    interface FSRouterIncomingMessage extends IncomingMessage {
        params: {
            [paramName: string]: string
        },
        query: {
            [paramName: string]: string
        }
    }
    export type RequestHandler = (req: FSRouterIncomingMessage, res: ServerResponse) => any;
}