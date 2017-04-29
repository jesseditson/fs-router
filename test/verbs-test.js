const path = require('path')
const test = require('tape')
const router = require('..')

let match = router(path.join(__dirname, '/fixtures/verbs'))
const verbs = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS']

test('correctly maps various verbs', t => {
  t.plan(verbs.length * 2)
  verbs.forEach(verb => {
    let fn = match({ url: '/verbs', method: verb })
    t.equal(typeof fn, 'function', `${verb} is a function`)
    t.equal(fn(), verb, `${verb} is properly mapped`)
  })
})
