/* yarn example/ */
import start from './start'

(async () => {
  const { server } = await start({
    hotReload: {
      getServer: () => server,
    },
  })
})()