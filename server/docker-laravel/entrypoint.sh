#!/bin/sh

PORT_NUMBER=${PORT:-80}
echo "Configurando Apache para escuchar en el puerto: $PORT_NUMBER"

sed -i "s/Listen 80/Listen $PORT_NUMBER/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:$PORT_NUMBER>/g" /etc/apache2/sites-available/000-default.conf

# Limpiar cualquier caché previa (bootstrap/cache/*.php) antes de recachear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Asegurar que storage esté enlazado para cache de archivos
php artisan storage:link --force 2>/dev/null || true

echo "Optimizando caché de configuración y rutas de Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Ejecutando migraciones de base de datos..."
    php artisan migrate --force
fi

exec apache2-foreground
