# Image PPH légère
FROM php:8.2-fpm-alpine

# Dépendances système nécessaires
RUN apk add --no-cache \
    git \
    unzip \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    mysql-client \
    linux-headers \
    $PHPIZE_DEPS

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

# Active le cache en ligne de commande
RUN echo "apc.enable_cli=1" > /usr/local/etc/php/conf.d/apcu.ini

ENV APP_ENV=dev
ENV COMPOSER_ALLOW_SUPERUSER=1

# Répertoire de l'application
WORKDIR /var/www/html

# Copie du code
COPY . .

# Installation des dépendances
RUN composer install --no-interaction --optimize-autoloader --no-scripts

# Port PHP-FPM
EXPOSE 9000

# Démarrage du serveur
CMD ["php-fpm"]