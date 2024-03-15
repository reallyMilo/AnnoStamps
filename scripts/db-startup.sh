#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"
docker-compose up -d
echo '🟡 - Docker-compose up -d starting...'