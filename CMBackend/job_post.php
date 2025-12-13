<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');  // If using sessions

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);  // Disable in production

// Database connection
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'careermatch';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    error_log('DB Error: ' . $e->getMessage());
    exit;
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Check if FormData (with files) or JSON
$photoPath = null;
if (!empty($_FILES)) {
    // Handle FormData input
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $company = isset($_POST['company']) ? trim($_POST['company']) : '';
    $location = isset($_POST['location']) ? trim($_POST['location']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $type = isset($_POST['type']) ? trim($_POST['type']) : '';
    $salary = isset($_POST['salary']) ? trim($_POST['salary']) : '';
    $degree = isset($_POST['degree']) ? trim($_POST['degree']) : '';
    $experience = isset($_POST['experience']) ? trim($_POST['experience']) : '';
    $employmentLevel = isset($_POST['employmentLevel']) ? trim($_POST['employmentLevel']) : '';

    // Handle photo upload
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $fileType = mime_content_type($_FILES['photo']['tmp_name']);
        $fileSize = $_FILES['photo']['size'];

        if (in_array($fileType, $allowedTypes) && $fileSize < 5000000) { // Max 5MB
            $filename = uniqid() . '_' . basename($_FILES['photo']['name']);
            $filepath = $uploadDir . $filename;
            if (move_uploaded_file($_FILES['photo']['tmp_name'], $filepath)) {
                $photoPath = 'uploads/' . $filename; // Relative path for DB
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to upload photo']);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid photo type or size']);
            exit;
        }
    }
} else {
    // Fallback to JSON input (for backward compatibility)
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input: ' . json_last_error_msg()]);
        error_log('JSON Error: ' . json_last_error_msg() . ' | Raw: ' . $rawInput);
        exit;
    }

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit;
    }

    $title = isset($input['title']) ? trim($input['title']) : '';
    $company = isset($input['company']) ? trim($input['company']) : '';
    $location = isset($input['location']) ? trim($input['location']) : '';
    $description = isset($input['description']) ? trim($input['description']) : '';
    $type = isset($input['type']) ? trim($input['type']) : '';
    $salary = isset($input['salary']) ? trim($input['salary']) : '';
    $degree = isset($input['degree']) ? trim($input['degree']) : '';
    $experience = isset($input['experience']) ? trim($input['experience']) : '';
    $employmentLevel = isset($input['employmentLevel']) ? trim($input['employmentLevel']) : '';
}

// Validate required fields
if (empty($title) || empty($company) || empty($location) || empty($description)) {
    http_response_code(400);
    echo json_encode(['error' => 'Required fields are missing: title, company, location, description']);
    exit;
}

// Optional: Add session check if only logged-in companies can post
// session_start();
// if (!isset($_SESSION['company_id'])) {
//     http_response_code(401);
//     echo json_encode(['error' => 'Unauthorized']);
//     exit;
// }

// Prepare and execute insert
try {
    $stmt = $conn->prepare("
        INSERT INTO jobs 
        (title, company, location, type, salary, description, degree, experience, employmentLevel, datePosted, Photo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    ");
    $stmt->execute([$title, $company, $location, $type, $salary, $description, $degree, $experience, $employmentLevel, $photoPath]);
    
    echo json_encode(['success' => true, 'message' => 'Job posted successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to post job']);
    error_log('Insert Error: ' . $e->getMessage());
}

$conn = null;  // Close connection
?>