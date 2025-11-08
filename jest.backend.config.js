export default {
  // display name
  displayName: "backend",

  // when testing backend
  testEnvironment: "node",

  // which test to run
  testMatch: ["<rootDir>/controllers/*.test.js"],

  // Pass with no tests (since we're only testing frontend for this assignment)
  passWithNoTests: true,

  // jest code coverage - disabled for backend as we're not testing admin/backend functions
  // collectCoverage: true,
  // collectCoverageFrom: ["controllers/**"],
  // coverageThreshold: {
  //   global: {
  //     lines: 100,
  //     functions: 100,
  //   },
  // },
};
