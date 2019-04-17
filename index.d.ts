import { IncomingMessage } from 'http'
import { RequestHandler } from 'micro'

declare module 'fs-router' {
    // eslint-disable-next-line  @typescript-eslint/class-name-casing
    interface fConfig {
        filter?: (f: string) => boolean;
        ext?: string[];
    }

    export function match(req: IncomingMessage): RequestHandler | void

    export default function router(routesDir: string, config?: fConfig): (req: IncomingMessage) => RequestHandler | void
}

