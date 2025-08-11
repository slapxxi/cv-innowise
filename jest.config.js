export default {
  testEnvironment: 'jest-fixed-jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^test-utils$': '<rootDir>/test-utils',
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(graphql-request|cv-graphql)/)'],
  testPathIgnorePatterns: ['<rootDir>/spec'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  silent: false,
};
