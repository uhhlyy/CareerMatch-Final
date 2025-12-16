<?php
// Remove temporary error reporting after debugging:
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

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
    
    // Initialize users array as empty since the query is failing
    $users = [];

    // --- 1. COMMENTED OUT FAILING USER QUERY ---
    // The table 'seekers' does not exist. 
    /*
    $userSql = "
        SELECT id, email, 'seeker' as role FROM seekers
        UNION ALL
        SELECT id, email, 'employer' as role FROM employers
    ";
    $userStmt = $db->query($userSql);
    $users = $userStmt->fetchAll(PDO::FETCH_ASSOC);
    */


    // --- 2. FETCH JOB POSTINGS (Assuming column is 'company' - adjust if wrong) ---
    // If your column is 'company_name', change 'j.company' back to 'j.company_name'
    $jobSql = "SELECT j.id, j.title, j.employer_id, j.company FROM jobs j ORDER BY j.id DESC"; 
    $jobStmt = $db->query($jobSql);
    $jobs = $jobStmt->fetchAll(PDO::FETCH_ASSOC);

    // --- 3. FETCH RESUMES (Using SeekerID and FullName, which are correct) ---
    $resumeSql = "SELECT r.id, r.FullName, r.Skills, r.SeekerID FROM resumes r ORDER BY r.id DESC";
    $resumeStmt = $db->query($resumeSql);
    $resumes = $resumeStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "users" => $users, // Will be empty, preventing user tables from displaying data
        "jobs" => $jobs,
        "resumes" => $resumes
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        // Returning the error message for debugging in the browser console
        "error" => "Database Error: " . $e->getMessage() 
    ]);
}
?>