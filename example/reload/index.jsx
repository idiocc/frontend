/* yarn example/ */
import rqt from 'rqt'
import start from '../start'

(async () => {
  /* start example */
  const watchers = {}
  const { app, url, server } = await start({
    hotReload: {
      getServer: () => server,
      watchers,
    },
  })
  const res = await rqt(`${url}/example/reload/Example`)
  console.log(res)
  Object.values(watchers).forEach(a => {
    a.close()
  })
  /* end example */
  await app.destroy()
})()