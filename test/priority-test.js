const path = require('path')
const test = require('tape')
const router = require('..')

let match = router(path.join(__dirname, '/fixtures/priority'))

test('matches high priority on collision with default', t => {
  t.plan(1)
  let fn = match({ url: '/priority', method: 'GET' })
  t.equal(fn(), 'HIGH')
})

test('matches high priority on collision with low', t => {
  t.plan(1)
  let fn = match({ url: '/foo', method: 'GET' })
  t.equal(fn(), 'HIGH')
})
