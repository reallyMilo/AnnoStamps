#!/bin/bash

# Exit if any of the following commands exit with non-0, and echo our commands back
set -ex

# For running npm "binaries"
PATH=$PATH:./node_modules/.bin

# Check that we're running the correct version of node
check-node-version --package

# Compile TypeScript into "temp" (defined is tsconfig.json)
tsc

# Install production dependencies under "temp"
cp package*.json temp
(cd temp && npm install --production)


# Ensure credentials.json exists
if [ ! -f credentials.json ]; then
  echo "Error: credentials.json not found!" >&2
  exit 1
fi

# Copy credentials.json into temp
cp credentials.json temp/

mkdir -p dist

# Create Lambda zipfile under "dist"
(cd temp && zip -r ../dist/updateStampDownloads.zip *)

# Clean up
rm -rf temp