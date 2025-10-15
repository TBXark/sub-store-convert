import esbuild from 'esbuild';
import process from 'node:process';

esbuild.build({
  entryPoints: ['src/index.js'],
  target: 'esnext',
  bundle: true,
  minify: false,
  outfile: './build/index.js',
  format: 'esm',
}).catch(() => process.exit(1))

