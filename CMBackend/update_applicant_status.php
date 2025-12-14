<?php
// Prevent HTML error output
ini_set('display_errors', 0); 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include 'db.php'; 

try {
    // 1. Get the PDO connection
    $db = isset($pdo) ? $pdo : (isset($conn) ? $conn : null);
    if (!$db) {
        throw new Exception("Database connection variable not found.");
    }

    // 2. Read the JSON input from React
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    // 3. Validate the fields (matching the React payload exactly)
    if (!isset($data['application_id']) || !isset($data['decision'])) {
        throw new Exception("Missing required fields. Received: " . $input);
    }

    $app_id = intval($data['application_id']);
    $decision = $data['decision']; // 'Accepted' or 'Rejected'

    // 4. Update the database using the Primary Key 'id'
    $sql = "UPDATE applications SET status = :status WHERE id = :id";
    $stmt = $db->prepare($sql);
    $success = $stmt->execute([
        'status' => $decision,
        'id' => $app_id
    ]);

    if ($success) {
        echo json_encode(["success" => true, "message" => "Status updated to $decision"]);
    } else {
        throw new Exception("Failed to execute database update.");
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "error" => $e->getMessage()
    ]);
}
?>