#!/bin/bash

# Publish release type (patch, minor, major)
RELEASE_TYPE=$1
if [ \( "$RELEASE_TYPE" = "patch" \) -o \( "$RELEASE_TYPE" = "minor" \) -o \( "$RELEASE_TYPE" = "major" \) ]
then

  # @webscale/cloud
  echo "prepare @microdocs/cloud"
  npm version $(VERSION)

  # @microdocs/cloud-rest-client
  echo "prepare @microdocs/cloud-rest-client"
  cd microdocs-cloud-rest-client
  npm version $(VERSION)
  npm install
  ./node_modules/.bin/gulp test
  ./node_modules/.bin/gulp build
  cd dist
  npm link
  cd ../../

  # @microdocs/cloud-rest-client-node
  echo "prepare @microdocs/cloud-rest-client-node"
  cd microdocs-cloud-rest-client-node
  npm version $(VERSION)
  npm link @microdocs/cloud-rest-client
  npm install
  ./node_modules/.bin/gulp test
  ./node_modules/.bin/gulp build
  cd ..

else

  echo "usage: script.sh <patch,minor,major>"
  exit 1

fi

