module.exports = {
  extends: ['airbnb', "plugin:jest/recommended", "plugin:security/recommended"],
  plugins: ["jest", "flowtype", "security"],
  parser: "babel-eslint",
  rules: {
    'arrow-parens': [
      2,
      'as-needed'
    ],
    'no-underscore-dangle': [
      0,
      'never'
    ],
    semi: [
      2,
      'never'
    ],
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  }
};
