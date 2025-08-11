#!/bin/bash

MODE=$1

if [ -z "$MODE" ]; then
  echo "Usage: $0 [local|docker|production]"
  exit 1
fi

# Detect current mode from .env (if exists)
if [ -f ".env" ]; then
  if grep -q "DB_HOST=localhost" .env; then
    current_mode="local"
  elif grep -q "DB_HOST=db" .env; then
    current_mode="docker"
  elif grep -q "DB_HOST=" .env; then
    current_mode="production"
  else
    current_mode="unknown"
  fi
else
  current_mode="none"
fi

# If already in the requested mode, do nothing
if [ "$MODE" == "$current_mode" ]; then
  echo "Already in $MODE mode, no changes made."
  exit 0
fi

# Switch environment
case "$MODE" in
  local)
    cp .env.local .env
    echo "Switched to local environment"
    ;;
  docker)
    cp .env.docker .env
    echo "Switched to docker environment"
    ;;
  production)
    cp .env.prod .env
    echo "Switched to production environment"
    ;;
  *)
    echo "Invalid mode: $MODE. Use local, docker, or production"
    exit 1
    ;;
esac
