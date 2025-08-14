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

ENV COMPOSER_ALLOW_SUPERUSER=1

# Répertoire de l'application
WORKDIR /var/www/html

# Copier les fichiers de dépendances en premier (pour le cache Docker)
COPY composer.json composer.lock ./

# Installer les dépendances avec les bonnes permissions
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copier tout le code source
COPY . .

# Exécuter les scripts post-install de Composer
RUN composer run-script --no-dev post-install-cmd || true

# Créer les dossiers nécessaires avec les bonnes permissions
RUN mkdir -p var/cache var/log var/sessions && \
    chmod -R 775 var/ && \
    chown -R www-data:www-data /var/www/html

# Exposer le port 9000 pour PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]