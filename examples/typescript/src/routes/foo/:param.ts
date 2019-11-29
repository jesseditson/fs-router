import { send } from 'micro'
import { RequestHandler } from 'fs-router'

export const GET: RequestHandler = async (req, res) => {
    send(res, 200, { params: req.params, query: req.query })
}