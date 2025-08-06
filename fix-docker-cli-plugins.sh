#!/bin/bash

set -e

# Define local plugin dir
PLUGIN_DIR="$HOME/.docker/cli-plugins"
mkdir -p "$PLUGIN_DIR"

echo "🧹 Cleaning up old broken Docker CLI plugins..."

sudo rm -f /usr/local/lib/docker/cli-plugins/docker-compose 2>/dev/null || true
sudo rm -f /usr/local/lib/docker/cli-plugins/docker-buildx 2>/dev/null || true

echo "📥 Downloading latest docker-compose plugin..."
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o "$PLUGIN_DIR/docker-compose"
chmod +x "$PLUGIN_DIR/docker-compose"

echo "📥 Downloading latest docker-buildx plugin..."
curl -SL https://github.com/docker/buildx/releases/latest/download/buildx-linux-amd64 \
  -o "$PLUGIN_DIR/docker-buildx"
chmod +x "$PLUGIN_DIR/docker-buildx"

echo "✅ Verifying installations..."

docker compose version
docker buildx version

echo "🎉 Done! Both docker compose and buildx are ready to use in WSL."
