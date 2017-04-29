const path = require('path')
const test = require('tape')
const router = require('..')

let match = router(path.join(__dirname, '/fixtures/simple'))

test('sets up routes from the fs', t => {
  t.plan(2)
  let req = { url: '/foo/bar', method: 'GET' }
  t.equal(typeof match(req), 'function', 'returns the route function')
  t.equal(match(req)(), 'bar', 'route function is callable')
})

test('adds query params to req', t => {
  t.plan(2)
  let req = { url: '/foo/bar?fizz=buzz', method: 'GET' }
  match(req)()
  t.equal(typeof req.query, 'object', 'appends a query object')
  t.equal(req.query.fizz, 'buzz', 'query object is properly parsed')
})

test('adds params object to req', t => {
  t.plan(1)
  let req = { url: '/foo/bar', method: 'GET' }
  match(req)()
  t.equal(typeof req.params, 'object', 'appends a params object')
})
