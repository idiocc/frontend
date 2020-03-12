// serves hr code
'/Component'

/* expected */
import { h } from '/node_modules/preact/dist/preact.mjs'
export let Example = () => {
  return h('div',{},`Test`)
}

export default class Class {}

/* IDIO HOT RELOAD */
import { idioHotReload } from '/hot-reload'
if (idioHotReload) {
  let _idio = 0
  idioHotReload('test/fixture/hot-reload/Component.jsx', async () => {
    _idio++
    const module = await import(`./Component?ihr=${_idio}`)
    Example = module['Example']
    return {
      module,
      classes: {
        'default': Class,
      },
    }
  })
}
/**/