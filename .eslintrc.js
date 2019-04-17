module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "import"
  ],
  "rules": {
    "react/jsx-filename-extension": 0,
    "arrow-body-style": 0,
    "react/prefer-stateless-function": 0,
    "no-use-before-define": 0,
    "no-alert": 0,
    "no-console": 0,
    "no-underscore-dangle": 0,
    "consistent-return": 0,
    "react/forbid-prop-types": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "react/no-did-update-set-state": 0,
    "import/prefer-default-export": 0
  },
  "parser": "babel-eslint",
  "globals": {
    "fetch": true,
    "alert": true,
    "__DEV__": true,
    "window": true,
    "document": true,
    "localStorage": true,
    "FileReader": true,
  }
};