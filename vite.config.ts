import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		cors: {
			origin: '*'
		},
		host: process.env.PUBLIC_BASE_IP,
		port: 8000,
		proxy: {}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
