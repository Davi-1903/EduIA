import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, projectRoot, 'VITE_');
    const apiTarget = env.VITE_CORS_ORIGINS_CLIENT?.split(',')[0]?.trim() || 'http://localhost:5000';

    return {
        plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
        server: {
            open: true,
            port: 3000,
            proxy: {
                '/api': apiTarget,
            },
        },
        preview: {
            port: 4173,
            proxy: {
                '/api': apiTarget,
            },
        },
        build: {
            rolldownOptions: {
                output: {
                    codeSplitting: {
                        groups: [
                            {
                                test: /node_modules\/(react|react-dom|react-helmet-async|react-router-dom|clsx)/,
                                name: 'vendor',
                            },
                            {
                                test: /node_modules\/(@tabler\/icons-react|@tailwindcss\/vite|react-markdown|remark-breaks|remove-markdown|tailwindcss)/,
                                name: 'ui',
                            },
                        ],
                    },
                },
            },
        },
    };
});
