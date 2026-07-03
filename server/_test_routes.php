<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->boot();

foreach ($app['router']->getRoutes() as $route) {
    if (strpos($route->uri(), 'api/organizations') !== false) {
        echo $route->uri() . " => " . json_encode($route->gatherMiddleware()) . "\n";
    }
}
echo "\n--- api/balances ---\n";
foreach ($app['router']->getRoutes() as $route) {
    if (strpos($route->uri(), 'api/balances') !== false) {
        echo $route->uri() . " => " . json_encode($route->gatherMiddleware()) . "\n";
    }
}
