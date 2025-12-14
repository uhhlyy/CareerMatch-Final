<?php
// Prevent any HTML errors from breaking the JSON response
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "careermatch";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("DB Connection failed");
    }

    // Get seeker_id from the React fetch URL
    $seeker_id = isset($_GET['seeker_id']) ? intval($_GET['seeker_id']) : 0;

    if ($seeker_id === 0) {
        echo json_encode(["hasResume" => false, "error" => "Invalid ID"]);
        exit;
    }

    // UPDATED: Column name is 'SeekerID' based on your 'describe resumes' output
    $stmt = $conn->prepare("SELECT id FROM resumes WHERE SeekerID = ? LIMIT 1");
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("i", $seeker_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Send back clear JSON
    echo json_encode([
        "success" => true,
        "hasResume" => ($result->num_rows > 0)
    ]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "hasResume" => false,
        "error" => $e->getMessage()
    ]);
}
?>