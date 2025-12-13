<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

include 'db.php';

try {
    $seekerID = $_POST['seekerID'] ?? null;
    if (!$seekerID) {
        echo json_encode(['success' => false, 'error' => 'User session lost.']);
        exit;
    }

    $photoPath = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        $fileName = time() . '_' . basename($_FILES['photo']['name']);
        $photoPath = $uploadDir . $fileName;
        move_uploaded_file($_FILES['photo']['tmp_name'], $photoPath);
    }

    $stmt = $conn->prepare("
        INSERT INTO resumes (
            SeekerID, FullName, Email, Title, Summary, Education, 
            Experience, Skills, AboutMe, MaritalStatus, Birthday, 
            PhoneNumber, City, Gender, Languages, JobPreferences, Photo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            FullName=VALUES(FullName), 
            Title=VALUES(Title), 
            Summary=VALUES(Summary), 
            Education=VALUES(Education), 
            Experience=VALUES(Experience), 
            Skills=VALUES(Skills),
            JobPreferences=VALUES(JobPreferences),
            Photo=IFNULL(VALUES(Photo), Photo)
    ");

    $stmt->execute([
        $seekerID, $_POST['fullName'], $_POST['email'], $_POST['title'], 
        $_POST['summary'], $_POST['education'], $_POST['experience'], 
        $_POST['skills'], $_POST['aboutMe'], $_POST['maritalStatus'], 
        $_POST['birthday'], $_POST['phoneNumber'], $_POST['city'], 
        $_POST['gender'], $_POST['languages'], $_POST['jobPreferences'], 
        $photoPath
    ]);

    echo json_encode(['success' => true, 'message' => 'Resume saved']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>