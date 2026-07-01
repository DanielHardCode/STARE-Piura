#!/bin/sh

PORT_NUMBER=${PORT:-80}
echo "Configurando Apache para escuchar en el puerto: $PORT_NUMBER"

sed -i "s/Listen 80/Listen $PORT_NUMBER/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:$PORT_NUMBER>/g" /etc/apache2/sites-available/000-default.conf

# Forzar limpieza de cachés antiguas
php artisan config:clear
php artisan cache:clear

echo "Optimizando caché de configuración y rutas de Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Ejecutando migraciones de base de datos..."
    php artisan migrate --force
fi

exec apache2-foreground
