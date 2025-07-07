const prettierConf = require('./.prettierrc.js');

module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		indent: ['off', 'tab'],
		// 箭头函数参数只有一个时不要有小括号
		'arrow-parens': 'off',
		// 'no-unused-vars': 'warn',
		'@typescript-eslint/no-unused-vars': 'warn',
		'prettier/prettier': ['error', { ...prettierConf }],
	},
};
