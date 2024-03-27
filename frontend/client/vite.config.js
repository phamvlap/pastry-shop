import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 4042,
        proxy: {
            '/api': {
                target: 'http://localhost:4040/',
                changeOrigin: true,
            },
        },
    },
    resolve: {
        alias: [
            {
                find: '~',
                replacement: path.resolve(__dirname, 'src'),
            },
        ],
    },
});
