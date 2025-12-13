<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// 1. Database Connection
$host = 'localhost';
$db   = 'careermatch';
$user = 'root';
$pass = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// 2. Load Composer
$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Vendor folder missing. Run composer require firebase/php-jwt']);
    exit;
}
require_once $autoloadPath;
use Firebase\JWT\JWT;

// 3. Login Logic
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing credentials']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT SeekerID, PasswordHash FROM jobseekers WHERE Email = ?");
        $stmt->execute([$email]);
        $seeker = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$seeker || !password_verify($password, $seeker['PasswordHash'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
            exit;
        }

        // 4. Generate Token
        $secret = 'your-jwt-secret'; // MUST BE SAME IN BOTH FILES
        $payload = [
            'seeker_id' => $seeker['SeekerID'],
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24)
        ];

        $token = JWT::encode($payload, $secret, 'HS256');

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'seekerID' => $seeker['SeekerID']
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}