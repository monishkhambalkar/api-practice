<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Slim\Psr7\Response;

class AuthMiddleware
{
    public function __invoke(Request $request, Handler $handler): Response
    {
        $authHeader = $request->getHeaderLine('Authorization');
        if (!$authHeader) {
            $response = new Response();
            $response->getBody()->write(json_encode(['error' => 'Unauthorized']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        try {
            $token = explode(" ", $authHeader)[1];
            $decoded = JWT::decode($token, new Key(getenv("JWT_SECRET"), 'HS256'));
            $request = $request->withAttribute("user", $decoded);
            return $handler->handle($request);
        } catch (Exception $e) {
            $response = new Response();
            $response->getBody()->write(json_encode(['error' => 'Invalid Token']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }
    }
}
