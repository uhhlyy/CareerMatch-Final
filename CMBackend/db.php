<?php
// Database connection settings (XAMPP defaults)
$host = "localhost";
$dbname = "careermatch";
$username = "root";
$password = ""; // Default XAMPP MySQL password is empty

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // In production, log this error instead of dying
    die("Database connection failed: " . $e->getMessage());
}
?>