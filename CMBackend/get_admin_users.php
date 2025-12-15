<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
header("Access-Control-Allow-Origin: " . $origin);
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

include 'db.php'; 

try {
    $db = isset($pdo) ? $pdo : $conn;

    // 1. Fetch from jobseekers (Using SeekerID and Email)
    $seekerStmt = $db->query("SELECT SeekerID as id, Email as email, 'seeker' as role FROM jobseekers");
    $seekers = $seekerStmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Fetch from employers (Using EmployerID and Email)
    $employerStmt = $db->query("SELECT EmployerID as id, Email as email, 'employer' as role FROM employers");
    $employers = $employerStmt->fetchAll(PDO::FETCH_ASSOC);

    // Merge the results
    $allUsers = array_merge($seekers, $employers);

    echo json_encode([
        "success" => true,
        "users" => $allUsers
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Database Error: " . $e->getMessage()
    ]);
}
?>