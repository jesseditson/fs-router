const path = require('path')
const fs = require('fs')
const qs = require('querystring')

const paramPattern = /:([^\/]+)/
// takes routes and decorates them with a 'match' method that will return { params, query } if a path matches
function addMatch(route) {
  let routePath = route.path
  let paramNames = []
  let matched
  // find any paths prefixed with a `:`, and treat them as capture groups
  while (matched = routePath.match(paramPattern)) {
    routePath = routePath.replace(paramPattern, '([^\?\/]+)')
    paramNames.push(matched[1])
  }
  // create a regex with our path
  let pattern = new RegExp(`^${routePath}\\??(.*)`, 'i')
  route.match = url => {
    let m = url.match(pattern)
    if (m) {
      let params = paramNames.reduce((o, p, idx) => {
        o[p] = m[idx + 1]
        return o
      }, {})
      let query = qs.parse(m[m.length - 1])
      return { params, query }
    }
  }
  return route
}

// recursively searches for all js files inside a directory tree, and returns their full paths
function findRoutes(dir) {
  let files = fs.readdirSync(dir)
  let resolve = f => path.join(dir, f)
  let routes = files.filter(f => path.extname(f) === '.js').map(resolve)
  let dirs = files.filter(f => fs.statSync(path.join(dir, f)).isDirectory()).map(resolve)
  return routes.concat(...dirs.map(findRoutes))
}

const val = v => (typeof v === 'undefined' ? 0 : v)
module.exports = function router(routesDir) {
  const routes = findRoutes(routesDir)
    // require route files, then add a 'path' property to them
    // the path is in the form of '/path/file', relative to routesDir
    .map(routeFile => {
      let route = require(routeFile)
      let extPattern = new RegExp(path.extname(routeFile) + '$')
      if (!route.path) {
        route.path = '/' + path.relative(routesDir, routeFile).replace(extPattern, '')
      }
      return route
    })
    // if a route exposes a `priority` property, sort the route on it.
    .sort((a, b) => val(a.priority) < val(b.priority) ? 1 : -1)
    .map(addMatch)

  // generated match method - call with a req object to get a route.
  return function match(req) {
    let routeFn = r => r[req.method] || (typeof r === 'function' && r)
    let found = routes.find(r => {
      let matched = r.match(req.url)
      let hasFn = routeFn(r)
      if (matched && hasFn) {
        Object.assign(req, matched)
        return true
      }
    })
    if (found) return routeFn(found)
  }
}
