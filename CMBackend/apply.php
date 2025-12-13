<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$conn = new mysqli("localhost", "root", "", "careermatch");

$data = json_decode(file_get_contents("php://input"), true);
$seekerId = $data['seeker_id'] ?? null;
$employerId = $data['employer_id'] ?? null;

if (!$seekerId || !$employerId) {
    echo json_encode(["success" => false, "message" => "Missing IDs"]);
    exit;
}

// Insert into applicantdecisions so it shows up in the tracker
$stmt = $conn->prepare("INSERT INTO applicantdecisions (ApplicantID, EmployerID, Decision) VALUES (?, ?, 'pending')");
$stmt->bind_param("ii", $seekerId, $employerId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Application submitted!"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}
?>