<?php
// CMBackend/delete_user.php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
header("Access-Control-Allow-Origin: " . $origin);
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id']) && isset($data['role'])) {
    try {
        $db = isset($pdo) ? $pdo : $conn;
        $id = $data['id'];
        
        // Target correct table and primary key based on role
        if ($data['role'] === 'seeker') {
            $stmt = $db->prepare("DELETE FROM jobseekers WHERE SeekerID = ?");
        } else {
            $stmt = $db->prepare("DELETE FROM employers WHERE EmployerID = ?");
        }

        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>