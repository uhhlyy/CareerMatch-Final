<?php
ini_set('display_errors', 0);  // hide errors from output
ini_set('log_errors', 1);      // log errors to server log
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Connect to database
    $conn = new PDO('mysql:host=localhost;dbname=careermatch;charset=utf8', 'root', '');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['first_name'], $input['last_name'], $input['email'], $input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// Check if email already exists
try {
    $stmt = $conn->prepare("SELECT * FROM employers WHERE Email = ?");
    $stmt->execute([$input['email']]);
    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit;
    }

    // Hash password
    $passwordHash = password_hash($input['password'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO employers (FirstName, LastName, Email, PasswordHash) VALUES (?, ?, ?, ?)");
$stmt->execute([$input['first_name'], $input['last_name'], $input['email'], $passwordHash]);
    echo json_encode(['success' => true, 'message' => 'Registration successful']);
} catch (PDOException $e) {
    error_log($e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
