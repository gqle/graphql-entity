module.exports = {
  documents: './src/graphql/**/*.graphql',
  // Default: './__generated__/'
  rootOutputPath: './src/graphql/__generated__/index.ts',
  // Valid dynamic patterns: dirpath, dirname, filename
  // Default: '[dirpath]/__generated__/',
  outputPath: '[dirpath]/__generated__/index.ts',
}
