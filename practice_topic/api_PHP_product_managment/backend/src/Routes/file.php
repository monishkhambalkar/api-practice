<?php

$app->post('/upload', function (Request $request, Response $response) {
    $uploadedFiles = $request->getUploadedFiles();
    $file = $uploadedFiles['file'];

    if ($file->getSize() > 2 * 1024 * 1024) { // Limit to 2MB
        return $response->withStatus(400)->withJson(['error' => 'File too large']);
    }

    $directory = __DIR__ . "/uploads";
    $filename = time() . "_" . $file->getClientFilename();
    $file->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

    $response->getBody()->write(json_encode(['message' => 'File uploaded', 'file' => $filename]));
    return $response->withHeader('Content-Type', 'application/json');
});
