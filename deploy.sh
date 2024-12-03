#!/bin/bash

set -e

source .env.production

bun --bun run vite build

tar -cf deploy.tar --exclude=deploy.tar \
    Dockerfile \
    build/ \
    package*.json \
    bun.lockb \
    src/

# Is CapRover installed?
if ! command -v caprover &> /dev/null
then
    echo "CapRover CLI could not be found. Install globally on your machine with npm install -g caprover"
    exit
fi

caprover deploy \
  --tarFile deploy.tar \
  --appName ${APP_NAME} \
  --appToken  ${APP_TOKEN} \
  --caproverUrl ${CAPROVER_URL}

rm deploy.tar