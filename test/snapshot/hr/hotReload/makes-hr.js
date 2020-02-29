/* IDIO HOT RELOAD */
if (window.idioHotReload) {
  let i = 0
  idioHotReload('test/Component.jsx', async () => {
    i++
    const module = await import(`./Component?ihr=${i}`)
    return {
      module,
      classes: {
        'default': Test,
        'C': C,
      },
    }
  })
}