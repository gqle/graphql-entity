module.exports = {
  documents: './src/**/*.graphql',
  // Default: './__generated__/'
  rootOutputPath: './src/gqle.generated.ts',
  // Valid dynamic patterns: dirpath, dirname, filename
  // Default: '[dirpath]/__generated__/',
  outputPath: '[dirpath]/[filename].generated.ts',
}
