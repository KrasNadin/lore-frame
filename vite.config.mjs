import { defineConfig, loadEnv } from 'vite'

import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint';
import path from 'path';

export default ({ mode }) => {
    const envFiles = {
        development: '.env',
        develop: '.env.develop',
        production: '.env.production'
    };

    process.env = {...process.env, ...loadEnv(mode, process.cwd(), envFiles[mode])};

    return defineConfig(
        {
            plugins: [
                react(),
                // eslint({
                //   include: ['./src/**/*.{js,jsx,ts,tsx}'],
                //   failOnError: false,
                //   exclude: ['./node_modules']
                // })
            ],
            server: {
                open: '/',
                port: 3000,
            },
            resolve: {
                alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
            },
        }
    )
}