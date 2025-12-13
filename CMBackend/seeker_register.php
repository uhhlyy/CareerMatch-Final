<?php
include 'db.php';
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success'=>false,'message'=>'Only POST allowed']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$firstName = trim($data['first_name'] ?? '');
$lastName  = trim($data['last_name'] ?? '');
$email     = trim($data['email'] ?? '');
$password  = $data['password'] ?? '';

if (!$firstName || !$lastName || !$email || !$password) {
    echo json_encode(['success'=>false,'message'=>'All fields are required']);
    exit;
}

// Check if email already exists
$check = $conn->prepare("SELECT * FROM jobseekers WHERE Email=?");  // Changed to jobseekers
$check->execute([$email]);
if ($check->rowCount() > 0) {
    echo json_encode(['success'=>false,'message'=>'Email already registered']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

// Insert into jobseekers table
$stmt = $conn->prepare("INSERT INTO jobseekers (FirstName, LastName, Email, PasswordHash) VALUES (?, ?, ?, ?)");  // Changed to jobseekers
if ($stmt->execute([$firstName, $lastName, $email, $hash])) {
    echo json_encode(['success'=>true,'message'=>'Registration successful']);
} else {
    echo json_encode(['success'=>false,'message'=>'Error registering user']);
}
?>