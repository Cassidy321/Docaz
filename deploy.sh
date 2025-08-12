#!/bin/bash

set -e

APP_ENV=${1:-production}
COMPOSE_FILE="docker-compose.yml"

if [ "$APP_ENV" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo "Deploying to production..."
    
    cp .env.production .env
    cp backend/.env.production backend/.env
    cp frontend/.env.production frontend/.env
else
    echo "Deploying to development..."
    
    cp .env.local .env
    cp backend/.env.local backend/.env
    cp frontend/.env.local frontend/.env
fi

git pull origin main

docker compose -f $COMPOSE_FILE down

docker compose -f $COMPOSE_FILE up -d --build

if [ "$APP_ENV" = "production" ]; then
    echo "Running database migrations..."
    docker compose -f $COMPOSE_FILE exec -T backend php bin/console doctrine:migrations:migrate --no-interaction
    
    echo "Clearing production cache..."
    docker compose -f $COMPOSE_FILE exec -T backend php bin/console cache:clear --env=prod
fi

sleep 10
docker compose -f $COMPOSE_FILE ps

echo "Deployment to $APP_ENV complete."

if [ "$APP_ENV" = "production" ]; then
    echo "Frontend: http://51.75.27.168"
    echo "API: http://51.75.27.168:8080"
fi