module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-param-reassign': [2, { props: false }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
