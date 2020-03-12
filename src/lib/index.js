import { collect } from 'catchment'
import { Replaceable } from 'restream'
import { relative, join, dirname, resolve } from 'path'
import findPackageJson from 'fpj'
import split from '@depack/split'

/**
 * Updates the source code of served JS files to point to the `/node_modules`, e.g., `import 'preact'` -> `import '/node_modules/preact/dist/preact.mjs'`.
 * @param {string} path The path to the file.
 * @param {string} source The source code of the file.
 * @param {_idio.FrontEndConfig} config The configuration.
 */
export const patchSource = async (path, source, { mount, override = {} }) => {
  const replacement = async (m, pre, from) => {
    const dir = dirname(path)
    // ignore local deps which are resolved by middleware
    if (/^[/.]/.test(from)) {
      return m
    }
    const { name, paths } = split(from)
    if (override[name]) return `${pre}'${override[name]}'`
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
 * @param {string} from File from which module was imported.
 * @param {string} path The import path.
 * @param {string} pre Text before import.
 * @param {string} [mount]
 */
const getNodeModule = (from, path, pre, mount) => {
  const modPath = join(from, path)
  let modRel = relative('', modPath)
  if (mount) modRel = relative(mount, modRel)
  return `${pre}'/${modRel}${/[/\\]$/.test(modPath) ? '/' : ''}'`
    .replace(/\\/g, '/')
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../').FrontEndConfig} _idio.FrontEndConfig
 */