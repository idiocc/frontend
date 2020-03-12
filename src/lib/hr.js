import { basename } from 'path'
import mismatch from 'mismatch'
import { EOL } from 'os'

/**
 * Returns exported clasess.
 * @param {string} content The contents of a file
 */
export const getClasses = (content) => {
  const d = mismatch(/^export\s+(default\s+)?class\s+([^\s{]+)/gm, content, ['def', 'name'])
  const dd = d.reduce((acc, { 'def': def, 'name': name }) => {
    acc[def ? 'default' : name] = name
    return acc
  }, {})
  return dd
}


/**
 * Returns exported consts and lets.
 * @param {string} content The contents of a file
 */
export const getAssignments = (content) => {
  const d = mismatch(/^export\s+(const|let)\s+(\S+)\s+=/gm, content, ['type', 'name'])
  const dd = d.reduce((acc, { 'type': type, 'name': name }) => {
    acc[name] = name
    return acc
  }, {})
  return dd
}

/**
 * Returns the code to append to modules to reload classes.
 * @param {string} path Path to the module.
 * @param {!Object} classes The object with classes
 * @param {!Object} assignments The object with assignments
 * @param {?string} [mod] The path to the hot reload script as a module.
 */
export const HR = (path, classes, assignments, mod = null) => {
  const s = Object.entries(classes).map(([k, v]) => {
    return `'${k}': ${v},`
  })
  return `/* IDIO HOT RELOAD */
${mod ? `import { idioHotReload } from '${mod}'` : 'const idioHotReload = window.idioHotReload'}
if (idioHotReload) {
  let _idio = 0
  idioHotReload('${path}', async () => {
    _idio++
    const module = await import(\`./${basename(path).replace(/\.jsx?$/, '')}?ihr=\${_idio}\`)
${Object.keys(assignments).map(a => `    if(\`\${${a}}\` != \`\${module['${a}']}\`) {
      console.log('Export %s updated', '${a}')
      ${a} = module['${a}']
    }`).join('\n')}
    return {
      module,${s.length ? `
      classes: {
${s.map(t => `        ${t}`).join(EOL)}
      },` : '' }
    }
  })
}`.replace(/\r?\n/g, EOL)
}