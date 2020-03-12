/* IDIO HOT RELOAD */
const idioHotReload = window.idioHotReload
if (idioHotReload) {
  let _idio = 0
  idioHotReload('test/Component.jsx', async () => {
    _idio++
    const module = await import(`./Component?ihr=${_idio}`)
    if(`${t}` != `${module['t']}`) {
      console.log('Export %s updated', 't')
      t = module['t']
    }
    if(`${i}` != `${module['i']}`) {
      console.log('Export %s updated', 'i')
      i = module['i']
    }
    return {
      module,
      classes: {
        'default': Test,
        'C': C,
      },
    }
  })
}