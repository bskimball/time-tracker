FROM php:7.4-fpm

# Arguments defined in docker-compose.yml
ARG user
ARG uid

ENV ACCEPT_EULA=Y

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    gnupg2 \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# MSSQL
RUN apt-get update \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/9/prod.list \
        > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get install -y --no-install-recommends \
       locales \
       apt-transport-https \
    && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen \
    && apt-get update \
    && apt-get -y --no-install-recommends install\
       unixodbc-dev \
       msodbcsql17

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && pecl install sqlsrv pdo_sqlsrv xdebug redis \
    && docker-php-ext-enable sqlsrv pdo_sqlsrv xdebug redis

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

COPY openssl.cnf /etc/ssl/openssl.cnf

# Set working directory
WORKDIR /var/www/backend

USER $user

RUN composer global require laravel/installer \
    && export PATH="$HOME/.composer/vendor/bin:$PATH"
