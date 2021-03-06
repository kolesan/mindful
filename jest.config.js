module.exports = {
  verbose: false,
  reporters: [
    // "default",
    ["jest-summarizing-reporter", {diffs: true}],
    // "jest-summarizing-reporter"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/test/__mocks__/styleMock.js"
  },
  setupFilesAfterEnv: [
    "jest-extended"
  ],
  coveragePathIgnorePatterns : [
    "TestUtils"
  ]
};