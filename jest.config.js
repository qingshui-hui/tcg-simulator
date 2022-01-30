module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
    }
  },
  moduleFileExtensions: [
    'js',
    'ts',
    'jsx',
    'json',
    // tell Jest to handle *.vue files
    'vue'
  ],
  transform: {
    // process *.vue files with vue-jest
    '^.+\\.vue$': require.resolve('vue3-jest'),
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      require.resolve('jest-transform-stub'),
    '^.+\\.jsx?$': require.resolve('babel-jest'),
    '^.+\\.tsx?$': require.resolve('ts-jest'),
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '/src/components/dropdown/',
  ],
  // support the same @ -> src alias mapping in source code
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testEnvironment: 'jsdom',
  // serializer for snapshots
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '<rootDir>/src/components/**/*.spec.[jt]s?(x)',
    '**/test/**/*.spec.[jt]s?(x)',
    '**/__tests__/*.[jt]s?(x)'
  ],
  // https://github.com/facebook/jest/issues/6766
  testURL: 'http://localhost/',
  // watchPlugins: [
  //   require.resolve('jest-watch-typeahead/filename'),
  //   require.resolve('jest-watch-typeahead/testname')
  // ],
  setupFiles: ['<rootDir>/test/jest.setup.js'],
}
