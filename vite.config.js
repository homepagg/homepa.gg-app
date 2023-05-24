import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [svgr(), react()],
    build: {
        outDir: 'build',
    },
    server: {
        port: 3000,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/tests/setup.js',
        css: true,
    },
});
