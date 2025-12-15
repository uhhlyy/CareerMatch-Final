<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php'; 

try {
    // Determine which connection variable is active from db.php
    $db = isset($pdo) ? $pdo : (isset($conn) ? $conn : null);
    $employer_id = isset($_GET['employer_id']) ? intval($_GET['employer_id']) : 0;

    if ($employer_id === 0) {
        echo json_encode([]);
        exit;
    }

    // UPDATED SQL: Joining the 'jobs' table to get the actual posted position
    $sql = "SELECT 
                a.id AS application_id, 
                a.status,
                CONCAT(js.FirstName, ' ', js.LastName) AS fullname, 
                js.Email AS email, 
                r.PhoneNumber AS phone,
                j.title AS job_title, -- FIXED: Pulls from the JOBS table, not the resume
                r.Summary, 
                r.Experience, 
                r.Education, 
                r.Skills, 
                r.AboutMe, 
                r.MaritalStatus, 
                r.Birthday, 
                r.City, 
                r.Gender, 
                r.Languages, 
                r.JobPreferences, 
                r.Photo
            FROM applications a
            JOIN jobseekers js ON a.seeker_id = js.SeekerID
            JOIN resumes r ON a.resume_id = r.id
            JOIN jobs j ON a.job_id = j.id -- NEW JOIN: Connects the application to the job post
            WHERE a.employer_id = :employer_id
            ORDER BY a.id DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute(['employer_id' => $employer_id]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "SQL Error: " . $e->getMessage()]);
}
?>