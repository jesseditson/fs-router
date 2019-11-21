const path = require('path')
const test = require('tape')
const router = require('..')

// set up config to filter only paths ending `index.js`
const config = { filter: f => /(?:^|[\/,\\])index.js$/.test(f) }

let match = router(path.join(__dirname, '/fixtures/filter'), config)

test('include non-filtered root path', t => {
  t.plan(2)
  let req = { url: '/', method: 'GET' }
  t.equal(typeof match(req), 'function', 'returns the route function')
  t.equal(match(req)(), 'index', 'route function is callable')
})

test('include non-filtered nested path', t => {
  t.plan(2)
  let req = { url: '/thing', method: 'GET' }
  t.equal(typeof match(req), 'function', 'returns the route function')
  t.equal(match(req)(), 'thing', 'route function is callable')
})

test('exclude filtered root path', t => {
  t.plan(1)
  let req = { url: '/other', method: 'GET' }
  t.equal(typeof match(req), 'undefined', 'excludes filtered paths')
})

test('exclude filtered nested path', t => {
  t.plan(1)
  let req = { url: '/thing/other', method: 'GET' }
  t.equal(typeof match(req), 'undefined', 'excludes filtered paths')
})
