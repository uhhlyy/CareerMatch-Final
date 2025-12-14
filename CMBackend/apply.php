<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "careermatch");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Connection failed"]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['seeker_id'], $data['job_id'], $data['employer_id'])) {
    $seeker_id = intval($data['seeker_id']);
    $job_id = intval($data['job_id']);
    $employer_id = intval($data['employer_id']);
    $action = isset($data['action']) ? $data['action'] : 'apply'; // 'apply' or 'decline'

    // Start a transaction to ensure both tables are updated together
    $conn->begin_transaction();

    try {
        // 1. Record the swipe in swiped_actions
        $stmt1 = $conn->prepare("INSERT INTO swiped_actions (seeker_id, job_id, action) VALUES (?, ?, ?)");
        $stmt1->bind_param("iis", $seeker_id, $job_id, $action);
        $stmt1->execute();

        // 2. If it was a right swipe (apply), create the Pending application
        if ($action === 'apply') {
            // Get the resume_id first (matching your SeekerID column)
            $resQuery = $conn->query("SELECT id FROM resumes WHERE SeekerID = $seeker_id LIMIT 1");
            $resume_row = $resQuery->fetch_assoc();
            $resume_id = $resume_row ? $resume_row['id'] : null;

            $stmt2 = $conn->prepare("INSERT INTO applications (resume_id, job_id, seeker_id, employer_id, status) VALUES (?, ?, ?, ?, 'Pending')");
            $stmt2->bind_param("iiii", $resume_id, $job_id, $seeker_id, $employer_id);
            $stmt2->execute();
        }

        $conn->commit();
        echo json_encode(["success" => true, "message" => "Action recorded as Pending"]);

    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Incomplete data"]);
}

$conn->close();
?>