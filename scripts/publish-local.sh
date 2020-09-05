custom_registry_url=http://localhost:4873
original_npm_registry_url=`npm get registry`
original_yarn_registry_url=`yarn config get registry`

# Set registry to local registry
npm set registry "$custom_registry_url"
yarn config set registry "$custom_registry_url"

# Login to publish packages
(cd && npx npm-auth-to-token@1.0.0 -u user -p password -e user@example.com -r "$custom_registry_url")

# ./scripts/exec.sh unpublish --force
./scripts/exec.sh npm publish

# Restore the original NPM and Yarn registry URLs
npm set registry "$original_npm_registry_url"
yarn config set registry "$original_yarn_registry_url"