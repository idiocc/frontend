import { basename } from 'path'
import mismatch from 'mismatch'

/**
 * Returns exported clasess.
 * @param {string} content The contents of a file
 */
export const getClasses = (content) => {
  const d = mismatch(/export\s+(default\s+)?class\s+([^\s{]+)/g, content, ['def', 'name'])
  const dd = d.reduce((acc, { 'def': def, 'name': name }) => {
    acc[def ? 'default' : name] = name
    return acc
  }, {})
  return dd
}

/**
 * Returns the code to append to modules to reload classes.
 * @param {string} path Path to the module.
 * @param {Object} classes The object with classes
 */
export const HR = (path, classes) => {
  const s = Object.entries(classes).map(([k, v]) => {
    return `'${k}': ${v},`
  })
  return `/* IDIO HOT RELOAD */
if (window.idioHotReload) {
  let i = 0
  idioHotReload('${path}', async () => {
    i++
    const module = await import(\`./${basename(path).replace(/\.jsx?$/, '')}?ihr=\${i}\`)
    return {
      module,
      classes: {
${s.map(t => `        ${t}`).join('\n')}
      },
    }
  })
}`
}
