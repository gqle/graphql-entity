# Exit the script on any command with non-0 return code
set -e

# Echo every command being executed
set -x

# Start in root directory
cd "$(dirname "$0")/.."

custom_registry_url=http://localhost:4873
original_npm_registry_url=`npm get registry`
original_yarn_registry_url=`yarn config get registry`

# Set registry to local registry
npm set registry "$custom_registry_url"
yarn config set registry "$custom_registry_url"

# Test that installation works without pulling any monorepo packages off of npm
# In other words, all monorepo package references should be the version in the repo
yarn install --pure-lockfile

# Build
yarn run build

# Login and publish packages locally
(cd && npx npm-auth-to-token@1.0.0 -u user -p password -e user@example.com -r "$custom_registry_url")

./scripts/exec.sh npm unpublish --force
./scripts/exec.sh npm publish

# Remove the yarn workspace so that the install hits the registry
rm package.json
rm yarn.lock
rm -rf node_modules

# Create a test application
mkdir test
cp examples/basic/package.json test/
cp examples/basic/tsconfig.test.json test/tsconfig.json
cp examples/basic/gqle.config.js test/
cp -r examples/basic/src test/

# Remove commited generated files from the test application
find test/src -type d -name __generated__ -prune -exec rm -rf {} \;

# Test the application
cd test

# Install dependencies from the local instance
yarn install
yarn add typescript

# Run graphql-entity compilation
yarn compile

# Ensure build output works
node ./node_modules/.bin/tsc -p tsconfig.json

# Restore the original NPM and Yarn registry URLs
npm set registry "$original_npm_registry_url"
yarn config set registry "$original_yarn_registry_url"