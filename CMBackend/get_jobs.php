<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php';

$seeker_id = isset($_GET['seeker_id']) ? intval($_GET['seeker_id']) : 0;

if ($seeker_id === 0) {
    echo json_encode(["error" => "Seeker ID required"]);
    exit;
}

try {
    $db = isset($pdo) ? $pdo : $conn;

    // Select jobs that the user HAS NOT applied for yet
    $sql = "SELECT j.*, e.CompanyName, e.CompanyLogo 
            FROM jobs j
            JOIN employers e ON j.EmployerID = e.EmployerID
            WHERE j.JobID NOT IN (
                SELECT job_id FROM applications WHERE seeker_id = :seeker_id
            )
            AND j.status = 'Open' 
            ORDER BY j.CreatedAt DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute(['seeker_id' => $seeker_id]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($jobs);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>