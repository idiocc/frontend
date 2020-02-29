/* IDIO HOT RELOAD */
if (window.idioHotReload) {
  let i = 0
  idioHotReload('test/Component.jsx', async () => {
    i++
    const module = await import(`./Component?ihr=${i}`)
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