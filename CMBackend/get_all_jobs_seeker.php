<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php'; 

// 1. Get Seeker ID from the URL
$seeker_id = isset($_GET['seeker_id']) ? intval($_GET['seeker_id']) : 0;

if ($seeker_id === 0) {
    echo json_encode(["success" => false, "error" => "Seeker ID required"]);
    exit;
}

try {
    $db = isset($pdo) ? $pdo : $conn;
    
    // 2. Query jobs that this seeker hasn't applied to or declined yet
    // This assumes you have an 'applications' table to track swipes
    $sql = "SELECT * FROM jobs 
            WHERE id NOT IN (
                SELECT job_id FROM applications WHERE seeker_id = :sid
            )
            ORDER BY id DESC";
            
    $stmt = $db->prepare($sql);
    $stmt->execute(['sid' => $seeker_id]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Return as a success object with a 'jobs' array
    echo json_encode([
        "success" => true,
        "jobs" => $jobs
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>