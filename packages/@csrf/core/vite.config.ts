import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		lib: {
			entry: {
				config: resolve(__dirname, 'src/config.ts'),
				protect: resolve(__dirname, 'src/protect.ts'),
				util: resolve(__dirname, 'src/util.ts'),
			},
			formats: ['es', 'cjs'],
		},
		outDir: 'dist',
		sourcemap: process.env.NODE_ENV !== 'production',
	},
	plugins: [
		dts({
			insertTypesEntry: true,
		}),
	],
})
