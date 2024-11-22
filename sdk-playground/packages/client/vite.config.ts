import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '../../', '');
	return {
		plugins: [react()],
		envDir: '../../',
		server: {
			port: Number.parseInt(env.WEBAPP_SERVE_PORT),
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
	};
});
