import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import postcssNesting from 'postcss-nesting';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [svgr(), react()],
    build: {
        outDir: 'build',
    },
    css: {
        postcss: {
            plugins: [postcssNesting],
        },
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
