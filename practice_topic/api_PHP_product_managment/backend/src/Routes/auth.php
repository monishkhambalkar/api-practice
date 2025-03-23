<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Firebase\JWT\JWT;
use Google\Client as Google_Client;

require_once __DIR__ . '../../../vendor/autoload.php'; // Ensure autoload is included
require_once __DIR__ . '/../Config/db.php';


// $app->post('/auth/google', function (Request $request, Response $response) {

//     $data = $request->getParsedBody();

//     if (!isset($data['token'])) {
//         $response->getBody()->write(json_encode(['error' => 'Token required']));
//         return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
//     }

//     $client = new Google_Client();
//     $client->setClientId("GOOGLE_CLIENT_ID");


//     // $payload = $client->verifyIdToken($data['token']);
//     // return $response->getBody()->write(json_encode([
//     //     'client' => get_class($client),
//     //     'methods' => get_class_methods($client),
//     // ]));
//     // die;

//     $data = json_decode(file_get_contents("php://input"), true);
//     return $token = $data['credential'] ?? null;
//     die;

//     try {
//         $payload = $client->verifyIdToken($data['token']);




//         if (!$payload) {
//             $response->getBody()->write(json_encode(['error' => 'Invalid Google token']));
//             return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
//         }

//         // Process user authentication
//         $pdo = getDB();
//         $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
//         $stmt->execute([$payload['email']]);
//         $user = $stmt->fetch();

//         if (!$user) {
//             $stmt = $pdo->prepare("INSERT INTO users (email, name, password) VALUES (?, ?, ?)");
//             $stmt->execute([$payload['email'], $payload['name'], $payload['sub']]);
//             $userId = $pdo->lastInsertId();
//         } else {
//             $userId = $user['id'];
//         }

//         $jwtPayload = [
//             'id' => $userId,
//             'email' => $payload['email'],
//             'exp' => time() + 3600
//         ];
//         $jwt = JWT::encode($jwtPayload, getenv("JWT_SECRET"), 'HS256');

//         $response->getBody()->write(json_encode(['token' => $jwt, 'user' => $payload]));
//         return $response->withHeader('Content-Type', 'application/json');
//     } catch (Exception $e) {
//         $response->getBody()->write(json_encode(['error' => 'Authentication failed']));
//         return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
//     }
// });

$app->post('/login', function (Request $request, Response $response) {

    $data = $request->getParsedBody();

    if (!isset($data['email']) || !isset($data['password'])) {
        $response->getBody()->write(json_encode(['error' => 'Email and password required']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    $email = $data['email'];
    $password = $data['password'];

    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $payload = [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'exp' => time() + 3600
        ];
        $jwt = JWT::encode($payload, getenv("monish"), 'HS256');

        $response->getBody()->write(json_encode(['token' => $jwt]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    $response->getBody()->write(json_encode(['error' => 'Invalid credentials']));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
});


$app->post('/register', function (Request $request, Response $response) {

    $data = $request->getParsedBody();

    if (
        !isset($data['email'])
        && !isset($data['password'])
        && !isset($data['name'])
    ) {
        $response->getBody()->write(json_encode(['error' => 'Email and password and name required']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    $email = $data['email'];
    $password = $data['password'];
    $name = $data['name'];

    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $payload = [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'exp' => time() + 3600
        ];
        $jwt = JWT::encode($payload, getenv("monish"), 'HS256');

        $response->getBody()->write(json_encode(['token' => $jwt]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    $response->getBody()->write(json_encode(['error' => 'Invalid credentials']));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
});
