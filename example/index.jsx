/* yarn example/ */
import idio from '@idio/idio'
import render from '@depack/render'
import frontend from '../src'

(async () => {
  const { url, app } = await idio({
    // logger: { use: true },
    _frontend: {
      use: true,
      middlewareConstructor(_, config) {
        return frontend(config)
      },
      config: {
        directory: 'example/frontend',
      },
    },
  }, { port: process.env.PORT })
  app.use(async (ctx) => {
    ctx.body = render(<html>
      <head><title>Example</title></head>
      <body>
        Hello World
        <script type="module" src="example/frontend"/>
      </body>
    </html>, { addDoctype: true })
  })
  console.log('Started on %s', url)
})()