# Image PHP CLI
FROM php:8.2-cli-alpine

# Dépendances système nécessaires
RUN apk add --no-cache \
    git \
    unzip \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    mysql-client \
    openssl \
    autoconf \
    gcc \
    g++ \
    make

# Extensions PHP pour Symfony
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    intl \
    zip \
    mbstring

# Installation de Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Cache pour améliorer les performances
RUN pecl install apcu && docker-php-ext-enable apcu
RUN echo "apc.enable_cli=1" > /usr/local/etc/php/conf.d/apcu.ini

ENV COMPOSER_ALLOW_SUPERUSER=1

# Répertoire de l'application
WORKDIR /var/www/html

# Copier les fichiers de dépendances en premier
COPY composer.json composer.lock ./

# Installer les dépendances de production
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copier tout le code source
COPY . .

# Exécuter les scripts post-install
RUN composer run-script --no-dev post-install-cmd || true

# Variables d'environnement
ENV APP_ENV=prod
ENV APP_DEBUG=false

ARG JWT_PASSPHRASE

# Générer les clés JWT automatiquement
RUN mkdir -p config/jwt && \
    openssl genrsa -out config/jwt/private.pem -aes256 -passout pass:${JWT_PASSPHRASE} 4096 && \
    openssl rsa -pubout -in config/jwt/private.pem -passin pass:${JWT_PASSPHRASE} -out config/jwt/public.pem

# Optimiser Symfony pour la production
RUN php bin/console cache:clear --env=prod --no-interaction || true
RUN php bin/console cache:warmup --env=prod --no-interaction || true

# Créer les dossiers nécessaires avec les bonnes permissions
RUN mkdir -p var/cache var/log var/sessions && \
    chmod -R 777 var/ && \
    chmod 644 config/jwt/*.pem

# Exposer le port 3000 pour Railway
EXPOSE 3000

# Commande pour démarrer le serveur PHP intégré
CMD ["php", "-S", "0.0.0.0:3000", "-t", "public/"]