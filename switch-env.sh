#!/bin/bash

ENV=$1
BASE=".env.$ENV"

if [ -z "$ENV" ]; then
  echo "❌ Missing argument: local, docker, or production"
echo "🔄 Current DATABASE_URL: $(grep DATABASE_URL .env)"
  exit 1
fi

if [ ! -f "$BASE" ]; then
  echo "⚠️ File '$BASE' not found. Aborting."
echo "🔄 Current DATABASE_URL: $(grep DATABASE_URL .env)"
  exit 1
fi

cp "$BASE" .env
echo "✅ Environment switched to '$BASE'"