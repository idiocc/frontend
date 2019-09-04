import { join } from 'path'
import core from '@idio/core'

const FIXTURE = 'test/fixture'

/**
 * A testing context for the package.
 */
export default class Context {
  /**
   * Start the server on a random port by default. The server will be destroyed automatically by the end of a test.
   * @param {import('@idio/core').MiddlewareConfig} [middleware] Middleware configuration.
   * @param {import('@idio/core').Config} [config] configuration object
   */
  async start(middleware = {}, config = {}) {
    const res = await core(middleware, {
      port: 0,
      ...config,
    })
    const { app } = res
    this.app = app
    return res
  }
  async _destroy() {
    if (this.app) await this.app.destroy()
  }
  /**
   * The frontend directory from which to serve client JavaScript.
   */
  get directory() {
    return 'test/fixture/frontend'
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