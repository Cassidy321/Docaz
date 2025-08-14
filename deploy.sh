#!/bin/bash

set -e

APP_ENV=${1:-production}

log() {
    echo "[$(date '+%H:%M:%S')] $1"
}

if [ "$APP_ENV" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    log "Déploiement en prod lancé"
    
    cp .env.production .env
    cp backend/.env.production backend/.env
    cp frontend/.env.production frontend/.env
else
    COMPOSE_FILE="docker-compose.yml"
    log "Déploiement en dev lancé"
    
    cp .env.local .env
    cp backend/.env.local backend/.env
    cp frontend/.env.local frontend/.env
fi

log "Pull des derniers changements"
git pull origin main

log "Arrêt des containers"
docker compose -f $COMPOSE_FILE down

log "Construction et lancement des containers"
docker compose -f $COMPOSE_FILE up -d --build

if [ "$APP_ENV" = "production" ]; then
    log "En attente des services"
    sleep 15
    
    log "Installation dépendances"
    docker compose -f $COMPOSE_FILE exec -T backend composer install --no-dev --optimize-autoloader --no-interaction || true

    log "Generation des clés JWT si besoin"
    docker compose -f $COMPOSE_FILE exec -T backend php bin/console lexik:jwt:generate-keypair --skip-if-exists || true

    log "Fix permissions clés JWT"
    docker compose -f $COMPOSE_FILE exec -T backend chown www-data:www-data config/jwt/private.pem config/jwt/public.pem || true
    docker compose -f $COMPOSE_FILE exec -T backend chmod 600 config/jwt/private.pem || true
    docker compose -f $COMPOSE_FILE exec -T backend chmod 644 config/jwt/public.pem || true
    
    log "Lancement migrations"
    docker compose -f $COMPOSE_FILE exec -T backend php bin/console doctrine:migrations:migrate --no-interaction
    
    log "Nettoyage cache"
    docker compose -f $COMPOSE_FILE exec -T backend php bin/console cache:clear --env=prod
fi

log "Déploiement réussi"
docker compose -f $COMPOSE_FILE ps

if [ "$APP_ENV" = "production" ]; then
    log "https://docaz.store"
else
    log "http://localhost"
fi