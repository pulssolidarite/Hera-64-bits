module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    // use the recommended rule set for both plain javascript and vue
    "eslint:recommended"
  ],
  globals: {
    __static: true
  },
  plugins: ["vue"],
  rules: {
    "no-undef": 1,
    "no-mixed-spaces-and-tabs": 1,
    "no-unused-vars": 1,
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    // allow debugger during development
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
};
