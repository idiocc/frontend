/* yarn example/ */
import core from '@idio/core'
import render from 'preact-render-to-string'
import frontend from '../src'

(async () => {
  const { url, router, app } = await core({
    logger: { use: true },
    _frontend: {
      use: true,
      middlewareConstructor(_, config) {
        return frontend(config)
      },
      config: {
        directory: 'example/frontend',
      },
    },
  })
  router.get('/', async (ctx) => {
    ctx.body = '<!doctype html>\n' + render(
      <html>
        <head><title>Example</title></head>
        <body>
          Hello World
          <script type="module" src="example/frontend"/>
        </body>
      </html>)
  })
  app.use(router.routes())
  console.log('Started on %s', url)
})()