import esbuild from 'esbuild';
import fs from 'node:fs';
import process from 'node:process';

const dependenciesLoader = (path) => Object.keys(JSON.parse(fs.readFileSync(path).toString()).dependencies)

const createPackageJsonPlugin = () => ({
  name: 'create-package-json',
  setup(build) {
    build.onEnd(() => {
      const packageJson = {
        ...(JSON.parse(fs.readFileSync('./package.json').toString())),
        "name": "sub-store-convert",
        "module": "./index.js",
        "main": "./index.js",
        "files": [
          "index.js",
        ]
      }
      delete packageJson.scripts
      fs.writeFileSync('./build/package.json', JSON.stringify(packageJson, null, 2))
    })
  }
})

esbuild.build({
  entryPoints: ['src/index.js'],
  target: 'esnext',
  bundle: true,
  minify: false,
  outfile: './build/index.js',
  format: 'esm',
  loader: { '.peg': 'text' },
  external: [
    ...dependenciesLoader('./src/vendors/Sub-Store/backend/package.json'),
    ...dependenciesLoader('./package.json')
  ],
  alias: {
    '@/core/app': './src/core/app'
  },
  plugins: [createPackageJsonPlugin()],
}).catch(() => process.exit(1))

