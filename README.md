# fs-router
Use the FS as your micro router
[![Build Status](https://travis-ci.org/jesseditson/fs-router.svg?branch=master)](https://travis-ci.org/jesseditson/fs-router)
[![Coverage Status](https://coveralls.io/repos/github/jesseditson/fs-router/badge.svg?branch=master)](https://coveralls.io/github/jesseditson/fs-router?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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
let match = require('fs-router')(__dirname + '/routes')

module.exports = async function(req, res) {
  let matched = match(req)
  if (matched) return await matched(req, res)
  send(res, 404, { error: 'Not found' })
}
```

The above usage assumes you have a folder called `routes` next to the `index.js` file, that looks something like this:
```
routes/
├── foo
│   └── :param
│       └── thing.js
└── things
    └── :id.js
```

the above tree would generate the following routes:
```
/foo/:param/thing
/things/:id
```

**defining a route**
```javascript
// routes/foo/bar.js
const { send } = require('micro')

// respond to specific methods by exposing their verbs
module.exports.GET = async function(req, res) {
  // fs-router decorates your req object with param and query hashes
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

**index routes**
```javascript
// routes/index.js
module.exports.GET = async function(req, res) {
  return 'hello!'
}
// The above route would be reachable at / and /index.
// This works for deep paths (/thing/index.js maps to /thing and /thing/index)
// and even for params (/thing/:param/index.js maps to /thing/* and /thing/*/index).
```

**filter routes**
```javascript
// index.js
const { send } = require('micro')

// set up config to filter only paths including `foo`
const config = {filter: f => f.indexOf('foo') !== -1}

// pass config to `fs-router` as optional second paramater
let match = require('fs-router')(__dirname + '/routes', config)

module.exports = async function(req, res) {
  let matched = match(req)
  if (matched) return await matched(req, res)
  send(res, 404, { error: 'Not found' })
}
```

The above usage assumes you have a folder called `routes` next to the `index.js` file, that looks something like this:
```
routes/
├── foo
│   ├── index.js
│   └── thing.js
└── bar
    ├── index.js
    ├── foo.js
    └── thing.js
```

the above tree would generate the following routes:
```
/foo
/foo/thing
/bar/foo
```

### Windows usage
Be aware that windows file systems do not allow using ```:``` in the
file/directory names.  In order to use this library effectively with routes that
include param ```/foo/:fooId/bar/:barIs``` you will need to set up custom paths
in your route files.
