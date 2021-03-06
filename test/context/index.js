import { join } from 'path'
import idio from '@idio/idio'

const FIXTURE = 'test/fixture'

/**
 * A testing context for the package.
 */
export default class Context {
  /**
   * Start the server on a random port by default. The server will be destroyed automatically by the end of a test.
   * @param {import('@idio/idio').MiddlewareConfig} [middleware] Middleware configuration.
   * @param {import('@idio/idio').Config} [config] configuration object
   */
  async start(middleware = {}, config = {}) {
    const res = await idio(middleware, {
      port: 0,
      ...config,
    })
    const { app } = res
    this.app = app
    return res
  }
  async _destroy() {
    if (this.app) await this.app.destroy()
    if (this._watchers) Object.values(this._watchers).forEach((w) => {
      w.close()
    })
  }
  /**
   * The frontend directory from which to serve client JavaScript.
   */
  get directory() {
    return 'test/fixture/frontend'
  }
  get watchers() {
    if (this._watchers) return this._watchers
    this._watchers = {}
    return this._watchers
  }
  /**
   * The frontend directory from which to serve client JavaScript.
   */
  get directory2() {
    return 'test/fixture/frontend2'
  }
  /**
   * Path to the fixture file.
   */
  get FIXTURE() {
    return join(FIXTURE, 'test.txt')
  }
  get SNAPSHOT_DIR() {
    return 'test/snapshot'
  }
}