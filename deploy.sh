#!/bin/bash
set -e

PROJECT_DIR="/var/www/business-arabic"
cd "$PROJECT_DIR"

echo "==> Pulling latest changes..."
git pull origin main

echo "==> Installing API dependencies..."
cd "$PROJECT_DIR/api"
npm install --production=false

echo "==> Building API..."
npm run build

echo "==> Installing App dependencies..."
cd "$PROJECT_DIR/app"
npm install --production=false

echo "==> Building App..."
npm run build

echo "==> Restarting services..."
cd "$PROJECT_DIR"
pm2 reload ecosystem.config.js

echo "==> Done! Deployment complete."
pm2 status
