module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
    transform: {
      '^.+\\.vue$': 'vue3-jest',
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.js$': 'babel-jest'
    },
    testMatch: [
      '**/tests/**/*.spec.js'
    ],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
    },
    transformIgnorePatterns: [
      '/node_modules/'
    ]
  };
  