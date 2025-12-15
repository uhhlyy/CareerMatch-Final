<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// 1. Include your PDO db connection
include 'db.php'; 

try {
    // 2. Count Active Jobs
    $stmtJobs = $conn->query("SELECT COUNT(*) FROM jobs");
    $jobsCount = $stmtJobs->fetchColumn();

    // 3. Count Employers
    $stmtEmployers = $conn->query("SELECT COUNT(*) FROM employers");
    $employerCount = $stmtEmployers->fetchColumn();

    // 4. Count Employed (Accepted Applications)
    // Make sure 'accepted' matches the exact string in your DB
    $stmtEmployed = $conn->prepare("SELECT COUNT(*) FROM applications WHERE status = :status");
    $stmtEmployed->execute(['status' => 'accepted']);
    $employedCount = $stmtEmployed->fetchColumn();

    // 5. Send JSON Response
    echo json_encode([
        "success" => true,
        "jobs" => (int)$jobsCount,
        "employers" => (int)$employerCount,
        "employed" => (int)$employedCount
    ]);

} catch (PDOException $e) {
    // Return the error message as JSON for debugging
    echo json_encode([
        "success" => false, 
        "message" => "SQL Error: " . $e->getMessage()
    ]);
}
?>