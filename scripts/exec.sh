#!/bin/bash

packages=(
  "express"
  "graphql-entity"
)

for package in ${packages[*]}; do
  pushd "./packages/$package"
    $@
  popd
done 
