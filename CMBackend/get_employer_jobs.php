<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php'; 

// Use the ID sent from the React frontend
$employer_id = isset($_GET['employer_id']) ? intval($_GET['employer_id']) : 0;

if ($employer_id === 0) {
    echo json_encode(["success" => false, "error" => "Employer ID is missing"]);
    exit;
}

try {
    $db = isset($pdo) ? $pdo : $conn;
    
    // Exact column name: employer_id
    $sql = "SELECT * FROM jobs WHERE employer_id = :eid ORDER BY id DESC";
    
    $stmt = $db->prepare($sql);
    $stmt->execute(['eid' => $employer_id]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // React expects an array for .map() to work
    echo json_encode($jobs); 

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>