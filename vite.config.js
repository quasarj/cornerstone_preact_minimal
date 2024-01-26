import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		crossOriginIsolation(),
		preact()
	],
	server: {
		headers: {
			'Access-Control-Allow-Origin': 'http://144.30.108.205:5173/',
		}
	}
});
