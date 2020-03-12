/* IDIO HOT RELOAD */
const idioHotReload = window.idioHotReload
if (idioHotReload) {
  let _idio = 0
  idioHotReload('test/Component.jsx', async () => {
    _idio++
    const module = await import(`./Component?ihr=${_idio}`)
    t = module['t']
    i = module['i']
    return {
      module,
      classes: {
        'default': Test,
        'C': C,
      },
    }
  })
}