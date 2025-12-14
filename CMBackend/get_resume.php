<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include 'db.php'; 

$seeker_id = isset($_GET['seeker_id']) ? intval($_GET['seeker_id']) : 0;

if ($seeker_id <= 0) {
    echo json_encode(["success" => false, "message" => "Missing Seeker ID"]);
    exit;
}

try {
    // UPDATED: Table name changed to 'jobseekers'
    $sql = "SELECT 
                js.FirstName, js.LastName, js.Email, 
                r.Summary, r.Education, r.Experience, 
                r.Skills, r.JobPreferences, r.City
            FROM jobseekers js
            LEFT JOIN resumes r ON js.SeekerID = r.SeekerID
            WHERE js.SeekerID = :sid";

    $stmt = $conn->prepare($sql);
    $stmt->execute(['sid' => $seeker_id]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode([
            "success" => true, 
            "resume" => $data
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "No profile found in jobseekers table."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>