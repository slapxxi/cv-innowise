export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(graphql-request|cv-graphql)/)'],
  testPathIgnorePatterns: ['<rootDir>/spec'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  silent: false,
};
