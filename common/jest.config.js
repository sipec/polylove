/** @type {import('ts-jest').JestConfigWithTsJest} */
import { pathsToModuleNameMapper }  from 'ts-jest';
import tsconfig from './tsconfig.json' with { type: 'json' };

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testMatch: ['**/*.test.ts'],
}
