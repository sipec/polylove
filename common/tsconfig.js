// hacky workaround for not being able to import tsconfig.json directly
export default {
  compilerOptions: {
    rootDir: 'src',
    composite: true,
    module: 'commonjs',
    moduleResolution: 'node',
    noImplicitReturns: true,
    outDir: 'lib',
    tsBuildInfoFile: 'lib/tsconfig.tsbuildinfo',
    sourceMap: true,
    strict: true,
    target: 'es2022',
    skipLibCheck: true,
    paths: {
      'common/*': ['./src/*', '../lib/*'],
    },
    resolveJsonModule: true,
  },
  include: ['src/**/*.ts'],
}
