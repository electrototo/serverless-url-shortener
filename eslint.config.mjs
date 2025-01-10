import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

import globals from 'globals';

export default tseslint.config(
    {
        ignores: [
            'dist/**',
            'eslint.config.mjs'
        ]
    },
    js.configs.recommended,
    tseslint.configs.recommended,
    {
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            '@stylistic': stylistic
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node
            }
        },
        rules: {
            '@typescript-eslint/no-unsafe-argument': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@stylistic/indent': ['error', 4],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/block-spacing': ['error', 'always'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/comma-spacing': ['error', {
                'before': false,
                'after': true
            }],
            'no-unused-vars': 'warn',
            'no-undef': 'warn',
        },
    }
);