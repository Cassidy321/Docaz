FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    git \
    unzip \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    mysql-client \
    linux-headers \
    $PHPIZE_DEPS

RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    intl \
    zip \
    mbstring

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN pecl install apcu && docker-php-ext-enable apcu

RUN echo "apc.enable_cli=1" > /usr/local/etc/php/conf.d/apcu.ini

ENV APP_ENV=dev
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

COPY . .

RUN composer install --no-interaction --optimize-autoloader --no-scripts

EXPOSE 9000

CMD ["php-fpm"]
