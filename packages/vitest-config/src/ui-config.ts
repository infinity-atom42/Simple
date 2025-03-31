import tsconfigPaths from 'vite-tsconfig-paths'
import { defineProject, mergeConfig } from 'vitest/config'

import react from '@vitejs/plugin-react'

import { baseConfig } from './base-config.js'

export const uiConfig = mergeConfig(
	baseConfig,
	defineProject({
		plugins: [react(), tsconfigPaths()],
		test: {
			environment: 'jsdom',
			css: true,
			include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
		},
	}),
)
