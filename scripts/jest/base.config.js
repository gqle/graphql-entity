module.exports = {
  snapshotSerializers: ['jest-snapshot-serializer-raw'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  testEnvironment: 'node',
}
