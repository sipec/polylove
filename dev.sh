#!/bin/bash

ENV=${1:-dev}
PROJECT=$2
case $ENV in
    dev)
      NEXT_ENV=DEV ;;
    prod)
      NEXT_ENV=PROD ;;
    *)
      echo "Invalid environment; must be dev or prod."
      exit 1
esac

DIR=web
export IS_MANIFOLD_LOVE=true

npx concurrently \
    -n API,NEXT,TS \
    -c white,magenta,cyan \
    "cross-env ENV=${NEXT_ENV} \
                      yarn --cwd=backend/api dev" \
    "cross-env NEXT_PUBLIC_API_URL=localhost:8088 \
              NEXT_PUBLIC_FIREBASE_ENV=${NEXT_ENV} \
              yarn --cwd=${DIR} serve" \
    "cross-env yarn --cwd=${DIR} ts-watch"
