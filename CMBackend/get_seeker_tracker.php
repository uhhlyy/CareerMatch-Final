<?php
ob_start();

// --- UNIVERSAL LOCALHOST CORS BLOCK ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// --- END CORS BLOCK ---

include 'db.php';

$seekerID = $_GET['seekerID'] ?? null;

if (!$seekerID || $seekerID === 'null') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No valid Seeker ID provided"]);
    exit;
}

try {
   // Inside your get_seeker_tracker.php
$query = "
    SELECT 
        a.status, 
        a.date_applied, 
        e.LastName, 
        r.JobPreferences,  -- Add this line
        r.Title as jobTitle, -- You can keep this or remove it
        r.Summary,
        r.Education,
        r.Skills,
        r.Experience
    FROM applications a
    JOIN employers e ON a.employer_id = e.EmployerID
    JOIN resumes r ON a.resume_id = r.id
    WHERE r.SeekerID = ?
    ORDER BY a.date_applied DESC
";

    $stmt = $conn->prepare($query);
    $stmt->execute([$seekerID]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $results]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>