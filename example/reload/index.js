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
  }, 'example/reload/App')
  const res = await rqt(`${url}/example/reload/Example`)
  console.log(res)
  /* end example */
  if (!process.env.LIVE)
    /* start example */
    // stop watching files
    Object.values(watchers).forEach(a => {
      a.close()
    })
    /* end example */
  if (!process.env.LIVE) await app.destroy()
})()