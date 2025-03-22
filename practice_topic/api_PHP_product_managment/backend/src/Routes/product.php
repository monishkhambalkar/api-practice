<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Psr7\Response;

$app->post('/products', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $name = $data['name'];
    $price = $data['price'];
    $category_id = $data['category_id'];

    $pdo = getDB();
    $stmt = $pdo->prepare("INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)");
    $stmt->execute([$name, $price, $category_id]);

    $response->getBody()->write(json_encode(['message' => 'Product added']));
    return $response->withHeader('Content-Type', 'application/json');
})->add(new AuthMiddleware());
