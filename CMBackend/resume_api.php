<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow CORS for React frontend
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Handle preflight requests
}

// Your existing database connection
$host = 'localhost';
$db = 'careermatch';
$user = 'root';
$pass = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['success'=>false,'message'=>'DB Connection failed: '.$e->getMessage()]));
}

// Helper function to verify SeekerID (basic example; replace with real auth)
function verifySeeker($seekerID) {
    // Example: Check if seekerID is valid (e.g., from session or JWT)
    // For now, just ensure it's provided and numeric
    return isset($seekerID) && is_numeric($seekerID);
}

// Handle POST request (Create resume)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit;
    }

    $seekerID = $input['seekerID'] ?? null;
    if (!verifySeeker($seekerID)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    // Map input to SQL columns
    $fullName = $input['fullName'] ?? '';
    $email = $input['email'] ?? '';
    $title = $input['title'] ?? 'Resume';
    $summary = $input['summary'] ?? '';
    $education = $input['education'] ?? '';
    $experience = $input['experience'] ?? '';
    $skills = $input['skills'] ?? '';
    $aboutMe = $input['aboutMe'] ?? '';
    $maritalStatus = $input['maritalStatus'] ?? '';
    $birthday = $input['birthday'] ?? null;
    $phoneNumber = $input['phoneNumber'] ?? '';
    $city = $input['city'] ?? '';
    $gender = $input['gender'] ?? '';
    $languages = $input['languages'] ?? '';
    $jobPreferences = json_encode($input['jobPreferences'] ?? []); // Store as JSON array (includes "Other" if provided)

    try {
        $stmt = $conn->prepare("
            INSERT INTO resumes (SeekerID, FullName, Email, Title, Summary, Education, Experience, Skills, AboutMe, MaritalStatus, Birthday, PhoneNumber, City, Gender, Languages, JobPreferences)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$seekerID, $fullName, $email, $title, $summary, $education, $experience, $skills, $aboutMe, $maritalStatus, $birthday, $phoneNumber, $city, $gender, $languages, $jobPreferences]);
        
        $resumeID = $conn->lastInsertId();
        http_response_code(201);
        echo json_encode(['message' => 'Resume created', 'resumeID' => $resumeID]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create resume: ' . $e->getMessage()]);
    }
    exit;
}

// Handle GET request (Fetch all resumes)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM resumes");
        $resumes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Decode JobPreferences JSON for easier frontend handling
        foreach ($resumes as &$resume) {
            $resume['JobPreferences'] = json_decode($resume['JobPreferences'], true) ?? [];
        }
        
        echo json_encode($resumes);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch resumes: ' . $e->getMessage()]);
    }
    exit;
}

// Invalid method
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>