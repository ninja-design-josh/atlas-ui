import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';

const compat = new FlatCompat();

export default [
  {
    ignores: ['node_modules', '.next', '.superpowers'],
  },
  ...compat.extends('next/core-web-vitals'),
];
