import { IncomingMessage } from 'http'
import { RequestHandler } from 'micro'

interface fConfig {
    filter: (f: string) => boolean
}

declare function match(req: IncomingMessage): RequestHandler | void
declare function router(routesDir: string, config?: fConfig): (req: IncomingMessage) => RequestHandler | void

export = router
