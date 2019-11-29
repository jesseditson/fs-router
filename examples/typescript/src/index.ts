import { send } from 'micro'
import router, {RequestHandler} from 'fs-router'

const match = router(__dirname + '/routes', {
  filter: f => f.indexOf('foo') !== -1,
  // Note that your source files will be .ts, but your dist will still
  // be .js files, so this will never need to have .ts
  ext: ['.js']
})

const indexHandler: RequestHandler = async (req, res) => {
  const matched = match(req)
  if (matched) return await matched(req, res)
  send(res, 404, { error: 'Not found' })
}

export default indexHandler