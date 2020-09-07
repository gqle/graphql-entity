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

./scripts/exec.sh npm publish

# Restore the original NPM and Yarn registry URLs
npm set registry "$original_npm_registry_url"
yarn config set registry "$original_yarn_registry_url"