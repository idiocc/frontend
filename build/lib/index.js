const { collect } = require('catchment');
const { Replaceable } = require('restream');
const { relative, join, dirname, resolve } = require('path');
let findPackageJson = require('fpj'); if (findPackageJson && findPackageJson.__esModule) findPackageJson = findPackageJson.default;
let split = require('@depack/split'); if (split && split.__esModule) split = split.default;

/**
 * Updates the source code of served JS files to point to the `/node_modules`, e.g., `import 'preact'` -> `import '/node_modules/preact/dist/preact.mjs'`.
 * @param {string} path
 * @param {string} source
 */
       const patchSource = async (path, source, mount) => {
  const replacement = async (m, pre, from) => {
    const dir = dirname(path)
    // ignore local deps which are resolved by middleware
    if (/^[/.]/.test(from)) {
      return m
    }
    const { name, paths } = split(from)
    const {
      packageJson,
    } = await findPackageJson(dir, name)
    const abs = resolve(packageJson)
    const realFrom = dirname(abs)
    // explicit dep, e.g., @depack/example/src/index.jsx
    if (paths) {
      return getNodeModule(realFrom, paths, pre, mount)
    }
    // try module
    const { module: mod } = require(abs)
    if (!mod) {
      console.warn('[↛] Package %s does not specify module in package.json, trying src', realFrom)
      const d = getNodeModule(realFrom, 'src', pre)
      return d
    }
    return getNodeModule(realFrom, mod, pre, mount)
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
const getNodeModule = (from, path, pre, mount) => {
  const modPath = join(from, path)
  let modRel = relative('', modPath)
  if (mount) modRel = relative(mount, modRel)
  return `${pre}'/${modRel}${modPath.endsWith('/') ? '/' : ''}'`
}

module.exports.patchSource = patchSource