import esbuild from 'esbuild';
import fs from 'node:fs';
import process from 'node:process';

const dependenciesLoader = (path) => (
  Object.keys(JSON.parse(fs.readFileSync(path).toString()).dependencies)
)

const createPackageJsonPlugin = ({source, target, extra}) => ({
  name: 'create-package-json',
  setup(build) {
    build.onEnd(() => {
      const packageJson = {
        ...(JSON.parse(fs.readFileSync(source).toString())),
        ...extra
      }
      delete packageJson.scripts
      fs.writeFileSync(target, JSON.stringify(packageJson, null, 2))
    })
  }
})

export function createIgnorePackagesPlugin(pkgs = []) {
  const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = pkgs.length
    ? new RegExp(`^(?:${pkgs.map(escape).join('|')})(?:\\/.*)?$`)
    : null;
  return {
    name: 'ignore-packages-simple',
    setup(build) {
      if (!re) return;
      build.onResolve({ filter: re }, args => ({ path: args.path, namespace: 'ignored' }));
      build.onLoad({ filter: /.*/, namespace: 'ignored' }, () => ({
        contents: 'export default {}; export const __ignored__ = {};',
        loader: 'js'
      }));
    }
  };
}

esbuild.build({
  entryPoints: ['src/index.js'],
  target: 'esnext',
  bundle: true,
  minify: false,
  outfile: './build/index.js',
  format: 'esm',
  loader: { '.peg': 'text' },
  external: [
    ...dependenciesLoader('./package.json')
  ],
  alias: {
    '@/core/app': './src/core/app'
  },
  plugins: [
    createPackageJsonPlugin({
      source: './package.json',
      target: './build/package.json',
      extra: {
        "name": "sub-store-convert",
        "module": "./index.js",
        "main": "./index.js",
        "files": [
          "index.js",
        ],
        "devDependencies": {},
      }
    }),
    createIgnorePackagesPlugin([
      'ip-address',
    ])
  ],
}).catch(() => process.exit(1))

