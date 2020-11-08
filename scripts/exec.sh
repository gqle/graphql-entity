#!/bin/bash

packages=(
  "graphql-entity"
)

for package in ${packages[*]}; do
  pushd "./packages/$package"
    $@
  popd
done 
