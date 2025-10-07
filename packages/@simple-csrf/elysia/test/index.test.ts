import { Elysia } from 'elysia'
import { describe, expect, it } from 'vitest'

import * as util from '@simple-csrf/core/util'
import { csrf, ElysiaConfig, ElysiaTokenOptions } from '../src/index'

function createApp() {
	return new Elysia()
		.use(csrf())
		.get('/', () => ({ success: true }))
		.post('/', () => ({ success: true }))
}

describe('ElysiaTokenOptions tests', () => {
	it('returns default values when options are absent', () => {
		const tokenOpts = new ElysiaTokenOptions()
		expect(tokenOpts.responseHeader).toEqual('X-CSRF-Token')
	})

	it('handles overrides', () => {
		const tokenOpts = new ElysiaTokenOptions({ responseHeader: 'XXX' })
		expect(tokenOpts.responseHeader).toEqual('XXX')
	})

	it('handles overrides of parent attributes', () => {
		const fn = async () => ''
		const tokenOpts = new ElysiaTokenOptions({ value: fn })
		expect(tokenOpts.value).toBe(fn)
	})
})