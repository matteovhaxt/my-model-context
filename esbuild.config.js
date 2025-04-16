const esbuild = require('esbuild')
const path = require('path')

esbuild
    .build({
        entryPoints: ['index.ts'],
        bundle: true,
        outfile: 'dist/index.js',
        platform: 'node',
        format: 'cjs',
        target: 'node18',
        external: ['@clack/prompts', 'zod'],
    })
    .catch(() => process.exit(1))
