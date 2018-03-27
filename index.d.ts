import { IncomingMessage } from 'http'
import { RequestHandler } from 'micro'

export interface fConfig {
    filter: (f: string) => boolean
}

export function match(req: IncomingMessage): RequestHandler | void
export function router(routesDir: string, config?: fConfig): (req: IncomingMessage) => RequestHandler | void
