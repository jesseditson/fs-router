const path = require('path')
const test = require('tape')
const router = require('..')

// use both ts and js scripts
const config = {ext: ['.js', '.ts']}

let match = router(path.join(__dirname, '/fixtures/extensions'), config)

test('includes the index.js', t => {
  t.plan(2)
  let req = { url: '/', method: 'GET' }
  t.equal(typeof match(req), 'function', 'returns the route function')
  t.equal(match(req)(), 'index', 'route function is callable')
})

test('includes the typescript file', t => {
  t.plan(2)
  let req = { url: '/typescript', method: 'GET' }
  t.equal(typeof match(req), 'function', 'returns the route function')
  t.equal(match(req)(), 'typescript', 'route function is callable')
})
