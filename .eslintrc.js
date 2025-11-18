module.exports = {
  env: {
    browser: true,
    es6: true,
    jquery: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module'
  },
  globals: {
    fabric: 'readonly',
    Easel: 'writable',
    Easel: 'writable'
  },
  rules: {
    // Allow computed member access with bracket notation
    'dot-notation': 'off',
    // Allow eval and Function constructor (was disabled in jshint)
    'no-eval': 'warn',
    'no-new-func': 'warn',
    // Other common relaxed rules for legacy code
    'no-unused-vars': 'warn',
    'no-undef': 'warn'
  }
};
