module.exports = {
    env: {
      browser: true,
      es2021: true
    },
    extends: ['airbnb-base', 'airbnb-typescript/base'],
    overrides: [
    ],
    parserOptions: {
      project: './tsconfig.json'
    },
    rules: {
      'linebreak-style': 0,
    }
  }
  
