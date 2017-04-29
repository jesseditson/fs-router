const path = require('path')
const test = require('tape')
const router = require('..')

let match = router(path.join(__dirname, '/fixtures/custom'))

test('uses custom path if provided', t => {
  t.plan(1)
  let fn = match({ url: '/random/custom/foo', method: 'GET' })
  t.equal(typeof fn, 'function', 'path matches properly')
})

test('uses properly parses params in custom path', t => {
  t.plan(1)
  let req = { url: '/random/custom/foo', method: 'GET' }
  match(req)
  t.equal(req.params.param, 'foo', 'param is correct')
})

test('does not set up the fs path', t => {
  t.plan(1)
  let fn = match({ url: '/custom', method: 'GET' })
  t.notOk(fn, 'file path is not set up')
})
