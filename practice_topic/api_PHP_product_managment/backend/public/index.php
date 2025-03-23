<?php

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();
$app->addRoutingMiddleware();
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return addCorsHeaders($response);
});

$app->add(function (Request $request, $handler) {
    $response = $handler->handle($request);
    return addCorsHeaders($response);
});

function addCorsHeaders(Response $response): Response
{
    return $response->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}




// Load routes
require __DIR__ . '/../src/Routes/auth.php';
require __DIR__ . '/../src/Routes/product.php';
require __DIR__ . '/../src/Routes/file.php';

$app->run();
