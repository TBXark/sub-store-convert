import esbuild from 'esbuild';
import fs from 'node:fs';

const dependenciesLoader = (path) => Object.keys(JSON.parse(fs.readFileSync(path).toString()).dependencies)

esbuild.build({
  entryPoints: ['src/index.js'],
  target: 'esnext',
  bundle: true,
  minify: false,
  outfile: './build/index.js',
  format: 'esm',
  loader: { '.peg': 'text' },
  external: [
    ...dependenciesLoader('./Sub-Store/backend/package.json'),
    ...dependenciesLoader('./package.json')
  ],
  alias: {
    '@/core/app': './src/core/app'
  },
}).catch(() => process.exit(1))