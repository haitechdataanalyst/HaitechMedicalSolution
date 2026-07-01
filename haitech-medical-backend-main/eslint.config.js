import js from '@eslint/js';
import security from 'eslint-plugin-security';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	// Base recommended rules
	js.configs.recommended,

	// Security plugin — catches SQL injection patterns, unsafe regex, etc.
	security.configs.recommended,

	// Prettier compat — disables ESLint rules that conflict with Prettier
	prettier,

	// Project-wide config
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2025,
			},
		},
		rules: {
			// --- Code Quality ---
			'no-console': 'warn', // Use logger instead of console.log
			'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'no-var': 'error', // Always use const/let
			'prefer-const': 'error', // Prefer const over let when not reassigned
			'no-duplicate-imports': 'error',
			eqeqeq: ['error', 'always'], // Always use === / !==
			curly: ['error', 'multi-line'], // Require braces for multi-line blocks

			// --- Error Prevention ---
			'no-return-await': 'error', // Unnecessary await in return
			'no-throw-literal': 'error', // Only throw Error objects
			'no-promise-executor-return': 'error',
			'no-template-curly-in-string': 'warn', // Catches 'Hello ${name}' (should be backticks)
			'require-atomic-updates': 'error', // Prevents race conditions in async

			// --- Security (supplement eslint-plugin-security) ---
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-new-func': 'error',
		},
	},

	// Ignore patterns
	{
		ignores: ['node_modules/', 'logs/', 'public/', 'docs/', '*.config.js'],
	},
];
