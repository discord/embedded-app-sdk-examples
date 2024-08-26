import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	envDir: '../../',
	server: {
		port: 3000,
		proxy: {
			'/api': {
				target: 'http://localhost:8787',
				changeOrigin: true,
				secure: false,
				ws: true,
				// rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
		hmr: {
			clientPort: 443,
		},
	},
});
