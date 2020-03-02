// serves hr code
'/Component'

/* expected */
import { h } from '/node_modules/preact/dist/preact.mjs'
export let Example = () => {
  return h('div',{},`Test`)
}

export default class Class {}

/* IDIO HOT RELOAD */
if (window.idioHotReload) {
  let i = 0
  idioHotReload('test/fixture/hot-reload/Component.jsx', async () => {
    i++
    const module = await import(`./Component?ihr=${i}`)
    if(`${Example}` != `${module['Example']}`) {
      console.log('Export %s updated', 'Example')
      Example = module['Example']
    }
    return {
      module,
      classes: {
        'default': Class,
      },
    }
  })
}
/**/