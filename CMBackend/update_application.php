<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'careermatch';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['application_id']) && isset($data['status'])) {
        $stmt = $conn->prepare("UPDATE applications SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['application_id']]);
        echo json_encode(["success" => true]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>