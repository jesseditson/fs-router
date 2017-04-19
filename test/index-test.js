const path = require('path')
const test = require('tape')
const router = require('..')

let match = router(path.join(__dirname, '/fixtures/index'))

test('uses index.js when the root is requested', t => {
  t.plan(2)
  let req = { url: '/', method: 'GET' }
  t.equal(typeof match(req), 'function', 'finds a route')
  t.equal(match(req)(), 'index', 'finds the index route')
})

test('uses index.js of a subfolder', t => {
  t.plan(2)
  let req = { url: '/thing', method: 'GET' }
  t.equal(typeof match(req), 'function', 'finds a route')
  t.equal(match(req)(), 'thing', 'finds the right route')
})

test('uses index.js of a parameter', t => {
  t.plan(2)
  let req = { url: '/test/foo', method: 'GET' }
  t.equal(typeof match(req), 'function', 'finds a route')
  t.equal(match(req)(), 'test/:param', 'finds the right route')
})

test('prefers a .js file to a nested index file when there is a conflict', t => {
  t.plan(2)
  let req = { url: '/conflict', method: 'GET' }
  t.equal(typeof match(req), 'function', 'finds a route')
  t.equal(match(req)(), 'conflict', 'finds the right route')
})
