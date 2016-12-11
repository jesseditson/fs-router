# micro-router
Use the FS as your micro router
[![Build Status](https://travis-ci.org/jesseditson/micro-router.svg?branch=master)](https://travis-ci.org/jesseditson/micro-router)
[![Coverage Status](https://coveralls.io/repos/github/jesseditson/micro-router/badge.svg?branch=master)](https://coveralls.io/github/jesseditson/micro-router?branch=master)

### "features"

- ✅ 0 runtime dependencies
- ✅ < 100 loc
- ✅ little or no config
- ✅ parameterized paths
- ✅ parses query string

### intent

[Micro](https://github.com/zeit/micro) is a fantastic library, but does not come with a router.
After using [next.js](https://github.com/zeit/next.js) and really enjoying the "fs as router" paradigm, I thought it might be nice to do the same with micro.

This is the simplest approach I could think of to create a flexible router that stays out of your way with an intuitive API.

### usage

**router usage**
```javascript
// index.js
const { send } = require('micro')
let match = require('micro-router')(__dirname + '/routes')

module.exports = async function(req, res) {
  let matched = match(req)
  if (matched) return await matched(req, res)
  send(res, 404, { error: 'Not found' })
}
```

**defining a route**
```javascript
// routes/foo/bar.js
const { send } = require('micro')

// respond to specific methods by exposing their verbs
module.exports.GET = async function(req, res) {
  // micro-router decorates your req object with param and query hashes
  send(res, 200, { params: req.params, query: req.query })
}
```

**path parameters**
```javascript
// routes/foos/:id.js
const { send } = require('micro')

// responds to any method at /foos/* (but not /foos or /foos/bar/baz)
module.exports = async function(req, res) {
  // params are always required when in a path, and the
  send(res, 200, { id: req.params.id })
}
```

**works great with async/await**
```javascript
const { send, json } = require('micro')
const qs = require('querystring')
require('isomorphic-fetch')

module.exports.GET = async function(req, res) {
  const query = qs.stringify(req.query)
  const data = await json(req)
  const res = await fetch(`http://some-url.com?${query}`)
  const response = await res.json()
  send(res, 200, response)
}
```

**priority**
```javascript
module.exports.GET = async function(req, res) {
  send(res, 200, {})
}
// all routes are sorted by this property - the higher numbers are matched first.
// kind of like a z-index for your routes.
// note that equal priority will just sort based on the fs in the case of a collision, which is not guaranteed order on OSX/Linux
module.exports.priority = -1
```

**custom path**
```javascript
// routes/whatever.js
module.exports.GET = async function(req, res) {
  send(res, 200, {})
}
// exposing a "path" will override the fs-generated one.
// This is nice if you wanted to avoid making a really deep tree for a one-off path (like for oauth callbacks)
// or if you just want to avoid putting `:` in your file/folder names or something
module.exports.path = '/foo/bar'
```
