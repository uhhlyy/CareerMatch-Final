<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
ini_set('display_errors', 0); 

include 'db.php'; 

try {
    $db = isset($pdo) ? $pdo : (isset($conn) ? $conn : null);
    $employer_id = isset($_GET['employer_id']) ? intval($_GET['employer_id']) : 0;

    if ($employer_id === 0) {
        echo json_encode(["error" => "Invalid Employer ID"]);
        exit;
    }

    // SQL FIX:
    // 1. Fullname from jobseekers (FirstName + LastName)
    // 2. Email from jobseekers
    // 3. Phone from resumes (PhoneNumber)
    // 4. Position from resumes (Title)
$sql = "SELECT 
            a.id AS application_id, 
            a.status,
            CONCAT(js.FirstName, ' ', js.LastName) AS fullname, 
            js.Email AS email, 
            r.PhoneNumber AS phone,
            r.Title AS job_title,
            r.Summary, r.Experience, r.Education, r.Skills, 
            r.AboutMe, r.MaritalStatus, r.Birthday, r.City, 
            r.Gender, r.Languages, r.JobPreferences, r.Photo
        FROM applications a
        JOIN jobseekers js ON a.seeker_id = js.SeekerID
        JOIN resumes r ON a.resume_id = r.id
        WHERE a.employer_id = :employer_id";

    $stmt = $db->prepare($sql);
    $stmt->execute(['employer_id' => $employer_id]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>