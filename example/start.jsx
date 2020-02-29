import idio, { render } from '@idio/idio'
import frontend from '../src'

/**
 * @param {import('..').FrontEndConfig} options
 */
export default async (options = {}) => {
  const { url, app, router, server } = await idio({
    // logger: { use: true },
    _frontend: {
      use: true,
      middlewareConstructor() {
        return frontend({
          directory: ['example/frontend', 'example/reload'],
          ...options,
        })
      },
    },
  }, { port: process.env.PORT })
  router.get('/', async (ctx) => {
    ctx.body = render(<html>
      <head><title>Example</title></head>
      <body>
        Hello World
        <script src="/hot-reload.js"/>
        <script type="module" src="example/frontend"/>
      </body>
    </html>, { addDoctype: true })
  })
  app.use(router.routes())
  console.error('Started on %s', url)
  return { app, url, server }
}