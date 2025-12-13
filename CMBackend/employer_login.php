<?php
// Ensure vendor/autoload is present for JWT
require_once __DIR__ . '/vendor/autoload.php';
use \Firebase\JWT\JWT;

include 'db.php';
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Email and password required.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT EmployerID, PasswordHash FROM employers WHERE Email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['PasswordHash'])) {
        
        // --- JWT GENERATION START ---
        $secret = 'your-jwt-secret'; // MUST MATCH get_seeker_application.php
        $issuedAt = time();
        $expire = $issuedAt + (60 * 60 * 24); // 24 hours

        $payload = [
            'employer_id' => $user['EmployerID'],
            'role' => 'employer',
            'iat' => $issuedAt,
            'exp' => $expire
        ];

        $token = JWT::encode($payload, $secret, 'HS256');
        // --- JWT GENERATION END ---

        echo json_encode([
            'success' => true, 
            'message' => 'Login successful!', 
            'token' => $token, // Send this to React!
            'employer_id' => $user['EmployerID']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials.']);
    }
}
?>