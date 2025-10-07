import { Elysia } from 'elysia'

import type { ConfigOptions } from '@simple-csrf/core/config'
import { Config, TokenOptions } from '@simple-csrf/core/config'
import { createCsrfProtect as _createCsrfProtect, CsrfError } from '@simple-csrf/core/protect'

export { CsrfError }

/**
 * Represents token options in config
 */
export class ElysiaTokenOptions extends TokenOptions {
	responseHeader: string = 'X-CSRF-Token'

	constructor(opts?: Partial<ElysiaTokenOptions>) {
		super(opts)
		Object.assign(this, opts)
	}
}

/**
 * Represents configuration object
 */
export class ElysiaConfig extends Config {
	override excludePathPrefixes: string[] = []

	override token: ElysiaTokenOptions = new ElysiaTokenOptions()

	constructor(opts?: Partial<ElysiaConfigOptions>) {
		super(opts)
		const newOpts = opts || {}
		if (newOpts.token) newOpts.token = new ElysiaTokenOptions(newOpts.token)
		Object.assign(this, newOpts)
	}
}

/**
 * Represents configuration options object
 */
export interface ElysiaConfigOptions extends Omit<ConfigOptions, 'token'> {
	token?: Partial<ElysiaTokenOptions>
}

/**
 * Create CSRF protection plugin for ElysiaJS
 * @param {Partial<ElysiaConfigOptions>} opts - Configuration options
 * @returns {Elysia} - Elysia plugin instance
 * @throws {CsrfError} - An error if CSRF validation failed
 * 
 * @example
 * ```ts
 * import { Elysia } from 'elysia'
 * import { csrf } from '@simple-csrf/elysia'
 * 
 * const app = new Elysia()
 *   .use(csrf())
 *   .get('/', () => 'Hello World')
 *   .listen(3000)
 * ```
 */
export function csrf(opts?: Partial<ElysiaConfigOptions>) {
	const config = new ElysiaConfig(opts)
	const _csrfProtect = _createCsrfProtect(config)

	return new Elysia({
		name: '@simple-csrf/elysia',
	})
		.state('csrfToken', undefined as string | undefined)
		.onBeforeHandle(async ({ request, cookie, set, store }) => {
			const url = new URL(request.url)

			try {
				// Execute CSRF protection
				const token = await _csrfProtect({
					request,
					url,
					getCookie: (name) => cookie[name]?.value as string | undefined,
					setCookie: (c) => {
						// Set the cookie using the name from the cookie object
						cookie[c.name]!.value = c.value
						// Set cookie attributes
						cookie[c.name]!.set({
							domain: c.domain,
							httpOnly: c.httpOnly,
							maxAge: c.maxAge,
							path: c.path,
							sameSite: c.sameSite,
							secure: c.secure,
							partitioned: c.partitioned,
						})
					},
				})

				// Store token in state
				store.csrfToken = token

				// Add token to response header
				if (token) set.headers[config.token.responseHeader] = token

			} catch (err) {
				if (err instanceof CsrfError) {
					set.status = 403
					return 'invalid csrf token'
				}
				throw err
			}
		})
		.derive(({ store }) => {
			return {
				csrfToken: store.csrfToken,
			}
		})
}

/**
 * Default export for convenience
 */
export default csrf
