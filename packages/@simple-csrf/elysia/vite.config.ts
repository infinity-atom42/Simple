import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
			},
			formats: ['es', 'cjs'],
		},
		outDir: 'dist',
		sourcemap: process.env.NODE_ENV !== 'production',
		rollupOptions: {
			external: ['@simple-csrf/core', 'cookie', 'express'],
		},
	},
	plugins: [
		dts({
			insertTypesEntry: true,
		}),
	],
})
