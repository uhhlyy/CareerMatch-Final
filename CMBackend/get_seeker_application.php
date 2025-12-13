<?php
ob_start();

// --- UNIVERSAL LOCALHOST CORS BLOCK ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// --- END CORS BLOCK ---

include 'db.php';

try {
    // Fetching pending resumes
    $stmt = $conn->query("SELECT * FROM resumes WHERE status IS NULL OR status = ''");
    $applicants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($applicants);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>