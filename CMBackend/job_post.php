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

// Database connection (switch to PDO for consistency with your login script)
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

// Decode JSON input
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Check for JSON decoding errors
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

// Extract and trim fields
$title = isset($input['title']) ? trim($input['title']) : '';
$company = isset($input['company']) ? trim($input['company']) : '';
$location = isset($input['location']) ? trim($input['location']) : '';
$description = isset($input['description']) ? trim($input['description']) : '';
$type = isset($input['type']) ? trim($input['type']) : '';
$salary = isset($input['salary']) ? trim($input['salary']) : '';
$degree = isset($input['degree']) ? trim($input['degree']) : '';
$experience = isset($input['experience']) ? trim($input['experience']) : '';
$employmentLevel = isset($input['employmentLevel']) ? trim($input['employmentLevel']) : '';

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
        (title, company, location, type, salary, description, degree, experience, employmentLevel, datePosted) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$title, $company, $location, $type, $salary, $description, $degree, $experience, $employmentLevel]);
    
    echo json_encode(['success' => true, 'message' => 'Job posted successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to post job']);
    error_log('Insert Error: ' . $e->getMessage());
}

$conn = null;  // Close connection
?>