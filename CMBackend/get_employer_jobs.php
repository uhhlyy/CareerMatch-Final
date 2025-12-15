<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php'; 

$employer_id = isset($_GET['employer_id']) ? intval($_GET['employer_id']) : 0;

if ($employer_id === 0) {
    echo json_encode(["success" => false, "error" => "Employer ID is missing"]);
    exit;
}

try {
    $db = isset($pdo) ? $pdo : $conn;
    
    // We count only rows in swiped_actions where action = 'apply' for each job
    $sql = "SELECT 
                j.*, 
                (SELECT COUNT(*) FROM swiped_actions WHERE job_id = j.id AND action = 'apply') AS applicant_count 
            FROM jobs j
            WHERE j.employer_id = :eid 
            ORDER BY j.id DESC";
    
    $stmt = $db->prepare($sql);
    $stmt->execute(['eid' => $employer_id]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($jobs); 

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>