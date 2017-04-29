const path = require('path')
const test = require('tape')
const router = require('..')

let match = router(path.join(__dirname, '/fixtures/params'))

test('files starting with `:` are treated as path params', t => {
  t.plan(1)
  let req = { url: '/things/27', method: 'GET' }
  match(req)()
  t.equal(req.params.id, '27', 'params are properly parsed')
})

test('folders starting with `:` are treated as path params', t => {
  t.plan(1)
  let req = { url: '/foo/bar/thing', method: 'GET' }
  match(req)()
  t.equal(req.params.param, 'bar', 'params are properly parsed')
})

test('root folder can start with `:`', t => {
  t.plan(1)
  let req = { url: '/anything/thing', method: 'GET' }
  match(req)()
  t.equal(req.params.root, 'anything', 'params are properly parsed')
})

test('multiple params in path', t => {
  t.plan(2)
  let req = { url: '/anything/anotherthing', method: 'GET' }
  match(req)()
  t.equal(req.params.root, 'anything', 'param 1 is parsed')
  t.equal(req.params.why, 'anotherthing', 'params 2 is parsed')
})
