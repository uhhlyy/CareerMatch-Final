<?php
// Set CORS to allow any localhost port
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (strpos($origin, 'http://localhost') !== false || strpos($origin, 'http://127.0.0.1') !== false) {
    header("Access-Control-Allow-Origin: " . $origin);
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php'; 

try {
    $db = isset($pdo) ? $pdo : $conn;

    // 1. Fetch from 'jobs' table (using your columns: title, company)
    $jobStmt = $db->query("SELECT id, title, company FROM jobs ORDER BY id DESC");
    $jobs = $jobStmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Fetch from 'resumes' table (using your columns: FullName, Skills)
    $resumeStmt = $db->query("SELECT id, FullName, Skills FROM resumes ORDER BY id DESC");
    $resumes = $resumeStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "jobs" => $jobs,
        "resumes" => $resumes
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Database Error: " . $e->getMessage()
    ]);
}
?>