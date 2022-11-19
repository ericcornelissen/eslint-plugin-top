#!/bin/sh

RESULT=$( \
  curl --silent \
    --output /dev/null \
    --write-out "%{http_code}" \
    --data-binary @./.github/codecov.yml \
    https://codecov.io/validate \
)

if [ "$RESULT" != "200" ]; then
  echo "Codecov validation failed (got $RESULT)"
  exit 1
else
  echo "Codecov validation succeeded"
fi
