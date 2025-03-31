import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import preserveDirectives from 'rollup-preserve-directives'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
				client: resolve(__dirname, 'src/client.tsx'),
				provider: resolve(__dirname, 'src/provider.tsx'),
			},
			formats: ['es', 'cjs'],
		},
		outDir: 'dist',
		sourcemap: process.env.NODE_ENV !== 'production',
		target: 'esnext',
		rollupOptions: {
			external: ['next', 'next/headers', 'next/server', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/server'],
			plugins: [preserveDirectives()],
			output: {
				preserveModules: true,
				compact: true,
				banner: '/**\n * Generated CSRF Next.js package\n * @license MIT\n */',
			},
		},
	},
	plugins: [
		react(),
		dts({
			insertTypesEntry: true,
			rollupTypes: true,
		}),
	],
})
