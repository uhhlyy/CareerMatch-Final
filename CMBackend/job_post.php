<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'careermatch';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Capture and convert data
    $employer_id = isset($_POST['employer_id']) ? intval($_POST['employer_id']) : 0;
    
    // Safety check for ID
    if ($employer_id <= 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid Employer ID. Please login again.']);
        exit;
    }

    // Mapping React keys to local variables
    $title           = $_POST['title'] ?? '';
    $company         = $_POST['company'] ?? '';
    $location        = $_POST['location'] ?? '';
    $type            = $_POST['type'] ?? '';
    $salary          = $_POST['salary'] ?? '';
    $description     = $_POST['description'] ?? '';
    $degree          = $_POST['degree'] ?? '';
    $experience      = $_POST['experience'] ?? '';
    $employmentLevel = $_POST['employmentLevel'] ?? '';
    $educationLevel  = $_POST['educationLevel'] ?? ''; // This was causing the error

    // 2. Handle File Upload
    $photoPath = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $fileName = time() . "_" . basename($_FILES["photo"]["name"]);
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["photo"]["tmp_name"], $targetFile)) {
            $photoPath = $targetFile; 
        }
    }

    // 3. Final SQL Statement
    // NOTE: If you run the ALTER TABLE command above, this will work perfectly.
    $sql = "INSERT INTO jobs (
                title, company, location, type, salary, 
                description, degree, experience, employmentLevel, 
                educationLevel, Photo, employer_id, datePosted
            ) VALUES (
                :title, :company, :location, :type, :salary, 
                :description, :degree, :experience, :level, 
                :edu, :photo, :eid, NOW()
            )";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':title'   => $title,
        ':company' => $company,
        ':location'=> $location,
        ':type'    => $type,
        ':salary'  => $salary,
        ':description' => $description,
        ':degree'  => $degree,
        ':experience' => $experience,
        ':level'   => $employmentLevel,
        ':edu'     => $educationLevel,
        ':photo'   => $photoPath,
        ':eid'     => $employer_id
    ]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    // This will now catch and show any other column mismatches
    echo json_encode(['success' => false, 'error' => "SQL Error: " . $e->getMessage()]);
}
?>