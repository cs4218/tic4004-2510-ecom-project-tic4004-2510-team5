module.exports = {
  // display name
  displayName: "backend",

  // when testing backend
  testEnvironment: "node",

  // which test to run
  testMatch: ["<rootDir>/client/src/tests/backend/*.test.js"],

  // jest code coverage
  collectCoverage: true,
  collectCoverageFrom: [
    //"client/**/*.js",
    //"!backend/**/index.js",
    "controllers/**",
  ],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
    },
  },
};
