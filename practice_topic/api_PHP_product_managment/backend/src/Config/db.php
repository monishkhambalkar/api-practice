<?php
function getDB()
{
    $host = "localhost";
    $db = "product_management";
    $user = "root";
    $pass = "plus91";
    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

    try {
        return new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    } catch (PDOException $e) {
        die("Database Connection Failed: " . $e->getMessage());
    }
}
