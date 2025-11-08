export default {
  // name displayed during tests
  displayName: "frontend",

  // simulates browser environment in jest

  testEnvironment: "jest-environment-jsdom",

  //  use babel to transform any jsx files
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },

  // tells jest how to handle css/scss imports
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },

  // ignore all node_modules except styleMock (needed for css imports)
  transformIgnorePatterns: ["/node_modules/(?!(styleMock\\.js)$)"],

  // only run these tests
  testMatch: [
    "<rootDir>/client/src/pages/Auth/*.test.js",
    "<rootDir>/client/src/components/Form/*.test.js",
    "<rootDir>/client/src/pages/*.test.js",
    "<rootDir>/client/src/pages/user/*.test.js"
  ],

  // jest code coverage
  collectCoverage: true,
  collectCoverageFrom: [
    "client/src/pages/Auth/**",
    "client/src/components/Form/**",
    "client/src/pages/CartPage.js",
    "client/src/pages/Search.js",
    "client/src/pages/ProductDetails.js",
    "client/src/pages/user/Profile.js"
  ],
  coverageThreshold: {
    global: {
      lines: 75,
      functions: 75,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/client/src/setupTests.js"],
};
