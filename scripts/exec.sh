#!/bin/bash

packages=(
  "cli"
  "compiler"
  "graphql-entity"
  "shared"
)

for package in ${packages[*]}; do
  pushd "./packages/$package"
    $@
  popd
done 
