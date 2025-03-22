<?php

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();
$app->addRoutingMiddleware();
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Load routes
require __DIR__ . '/../src/Routes/auth.php';
require __DIR__ . '/../src/Routes/product.php';
require __DIR__ . '/../src/Routes/file.php';

$app->run();
