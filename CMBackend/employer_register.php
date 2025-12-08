<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// DB CONNECTION
$host = "localhost";
$dbname = "careermatch";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// VALIDATE REQUEST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

// GET JSON INPUT
$data = json_decode(file_get_contents("php://input"), true);

$first_name = trim($data["first_name"] ?? "");
$last_name  = trim($data["last_name"] ?? "");
$email      = trim($data["email"] ?? "");
$password   = $data["password"] ?? "";

// VALIDATION
if (!$first_name || !$last_name || !$email || !$password) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email"]);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(["success" => false, "message" => "Password must be at least 6 characters"]);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// CHECK IF EMAIL EXISTS
$check = $conn->prepare("SELECT EmployerID FROM employers WHERE Email = ?");
$check->execute([$email]);

if ($check->fetch(PDO::FETCH_ASSOC)) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    exit;
}

// INSERT EMPLOYER (STRICT MODE SAFE)
$stmt = $conn->prepare(
    "INSERT INTO employers (FirstName, LastName, Email, PasswordHash, CreatedAt)
     VALUES (?, ?, ?, ?, NOW())"
);

if (!$stmt->execute([$first_name, $last_name, $email, $passwordHash])) {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed",
        "sql_error" => $stmt->errorInfo()[2]
    ]);
    exit;
}

echo json_encode(["success" => true, "message" => "Registration successful"]);
