const { collect } = require('catchment');
const { Replaceable } = require('restream');
const { relative, join, dirname, resolve } = require('path');
let findPackageJson = require('fpj'); if (findPackageJson && findPackageJson.__esModule) findPackageJson = findPackageJson.default;

       const splitFrom = (from) => {
  let [scope, name, ...paths] = from.split('/')
  if (!scope.startsWith('@') && name) {
    paths = [name, ...paths]
    name = scope
  } else {
    name = `${scope}/${name}`
  }
  return { name, paths: paths.join('/') }
}

/**
 * Updates the source code to point to the `node_modules`.
 */
       const patchSource = async (path, source) => {
  const replacement = async (m, pre, from) => {
    const dir = dirname(path)
    if (/^[/.]/.test(from)) { // ignore local deps
      return m
    }
    const { name, paths } = splitFrom(from)
    // explicit dep, e.g., @depack/example/src/index.jsx
    if (paths) {
      const {
        packageJson,
      } = await findPackageJson(dir, name)
      const realFrom = resolve(dirname(packageJson))
      return getNodeModule(realFrom, paths, pre)
    }
    // try module
    const {
      packageJson,
    } = await findPackageJson(dir, from)
    const realFrom = resolve(dirname(packageJson))
    const { module: mod } = require(resolve(packageJson))
    if (!mod) {
      console.warn('[↛] Package %s does not specify module in package.json, trying src', realFrom)
      const d = getNodeModule(realFrom, 'src', pre)
      return d
    }
    return getNodeModule(realFrom, mod, pre)
  }
  const rs = new Replaceable([
    {
      re: /^( *import(?:\s+[^\s,]+\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+)['"](.+)['"]/gm,
      replacement,
    },
    {
      re: /^( *import\s+)['"](.+)['"]/gm,
      replacement,
    },
  ])
  rs.end(source)
  const body = await collect(rs)
  return body
}


/**
 * Returns the import statement with the path to the dependency on the file system.
 */
const getNodeModule = (from, path, pre) => {
  const modPath = join(from, path)
  const modRel = relative('', modPath)
  return `${pre}'/${modRel}'`
}

module.exports.splitFrom = splitFrom
module.exports.patchSource = patchSource