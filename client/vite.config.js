import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
    server: {
        open: true,
        port: 3000,
        proxy: {
            '/api': 'http://localhost:5000',
        },
    },
    preview: {
        port: 4173,
        proxy: {
            '/api': 'http://localhost:5000',
        },
    },
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            test: /node_modules\/(react|react-dom|react-helmet-async|react-router-dom)/,
                            name: 'vendor',
                        },
                        {
                            test: /node_modules\/@tabler\/icons-react/,
                            name: 'ui',
                        },
                    ],
                },
            },
        },
    },
});
