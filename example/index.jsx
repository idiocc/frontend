/* yarn example/ */
import idio from '@idio/idio'
import render from '@depack/render'
import frontend from '../src'

(async () => {
  const { url, app, server } = await idio({
    // logger: { use: true },
    _frontend: {
      use: true,
      middlewareConstructor() {
        return frontend({
          directory: 'example/frontend',
          getServer: () => server,
          override: {
            preact: '/node_modules/preact/src/preact.js',
          },
        })
      },
    },
  }, { port: process.env.PORT })
  app.use(async (ctx) => {
    ctx.body = render(<html>
      <head><title>Example</title></head>
      <body>
        Hello World
        <script src="/hot-reload.js"/>
        <script type="module" src="example/frontend"/>
      </body>
    </html>, { addDoctype: true })
  })
  console.log('Started on %s', url)
})()