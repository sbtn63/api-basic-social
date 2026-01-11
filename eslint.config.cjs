module.exports = [
  {
    files: ["**/*.js"],
    rules: {
      "no-console": "warn"
    },
    env: {
      node: true,
      es6: true,
      jest: true
    },
    parserOptions: {
      ecmaVersion: 2018
    }
  }
]
