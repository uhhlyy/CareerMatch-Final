<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

include 'db.php'; 

$data = json_decode(file_get_contents("php://input"), true);

// We need applicant_id (the resume), employer_id (who swiped), and the decision
if (isset($data['applicant_id'], $data['decision'], $data['employer_id'])) {
    $resumeID = $data['applicant_id'];
    $decision = $data['decision']; 
    $employerID = $data['employer_id'];

    try {
        // Record the swipe in the applications table
        // 'ON DUPLICATE KEY UPDATE' ensures that if the company swipes again, it updates the old decision
        $stmt = $conn->prepare("
            INSERT INTO applications (resume_id, employer_id, status, date_applied) 
            VALUES (?, ?, ?, NOW()) 
            ON DUPLICATE KEY UPDATE status = VALUES(status), date_applied = NOW()
        ");
        
        $stmt->execute([$resumeID, $employerID, $decision]);

        echo json_encode(["success" => true, "message" => "Decision recorded for this employer"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
}
?>