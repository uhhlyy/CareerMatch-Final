<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['to_email']) || !isset($input['applicant_name']) || 
    !isset($input['job_title']) || !isset($input['employer_name'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

$to_email = filter_var($input['to_email'], FILTER_SANITIZE_EMAIL);
$applicant_name = htmlspecialchars($input['applicant_name']);
$job_title = htmlspecialchars($input['job_title']);
$employer_name = htmlspecialchars($input['employer_name']);
$employer_email = isset($input['employer_email']) ? filter_var($input['employer_email'], FILTER_SANITIZE_EMAIL) : 'noreply@careermatch.com';

// Validate email
if (!filter_var($to_email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

// Email subject
$subject = "Interview Invitation - $job_title Position at $employer_name";

// Email body (HTML format)
$message = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1F2937;
            margin-bottom: 20px;
        }
        .message-text {
            color: #4B5563;
            font-size: 15px;
            line-height: 1.8;
            margin-bottom: 20px;
        }
        .highlight-box {
            background: #EFF6FF;
            border-left: 4px solid #3B82F6;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .highlight-box strong {
            color: #1E40AF;
            font-size: 16px;
        }
        .cta-button {
            display: inline-block;
            background: #3B82F6;
            color: #ffffff;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            background: #F9FAFB;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
        }
        .footer p {
            margin: 5px 0;
            color: #6B7280;
            font-size: 13px;
        }
        .divider {
            height: 1px;
            background: #E5E7EB;
            margin: 30px 0;
        }
        .emoji {
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <div class='emoji'>🎉</div>
            <h1>Congratulations!</h1>
        </div>
        
        <div class='content'>
            <p class='greeting'>Dear $applicant_name,</p>
            
            <p class='message-text'>
                We are delighted to inform you that after carefully reviewing your application, 
                we would like to invite you for an <strong>initial interview</strong> for the position of:
            </p>
            
            <div class='highlight-box'>
                <strong>📋 Position: $job_title</strong><br>
                <strong>🏢 Company: $employer_name</strong>
            </div>
            
            <p class='message-text'>
                Your qualifications, skills, and experience have impressed our hiring team, 
                and we believe you could be an excellent fit for our organization.
            </p>
            
            <p class='message-text'>
                <strong>Next Steps:</strong><br>
                Our recruitment team will contact you within the next 2-3 business days with 
                specific details about the interview schedule, format, and any preparation materials 
                you may need.
            </p>
            
            <div class='divider'></div>
            
            <p class='message-text'>
                If you have any questions or need to discuss your availability, please don't 
                hesitate to reach out to us at your earliest convenience.
            </p>
            
            <p class='message-text'>
                We look forward to meeting you and learning more about your background and aspirations!
            </p>
            
            <p class='message-text' style='margin-top: 30px;'>
                <strong>Best regards,</strong><br>
                The Hiring Team<br>
                $employer_name
            </p>
        </div>
        
        <div class='footer'>
            <p><strong>CareerMatch Application Tracking System</strong></p>
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p style='margin-top: 15px; font-size: 12px;'>
                © " . date('Y') . " CareerMatch. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
";

// Plain text version for email clients that don't support HTML
$plain_text_message = "Dear $applicant_name,

We are delighted to inform you that after carefully reviewing your application, we would like to invite you for an initial interview for the position of $job_title at $employer_name.

Your qualifications, skills, and experience have impressed our hiring team, and we believe you could be an excellent fit for our organization.

Next Steps:
Our recruitment team will contact you within the next 2-3 business days with specific details about the interview schedule, format, and any preparation materials you may need.

If you have any questions or need to discuss your availability, please don't hesitate to reach out to us at your earliest convenience.

We look forward to meeting you and learning more about your background and aspirations!

Best regards,
The Hiring Team
$employer_name

---
This is an automated notification from CareerMatch Application Tracking System.
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: $employer_name <$employer_email>" . "\r\n";
$headers .= "Reply-To: $employer_email" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mail_sent = mail($to_email, $subject, $message, $headers);

if ($mail_sent) {
    // Log the email sent (optional - add to your database)
    // You can create a table to track sent emails for your records
    
    echo json_encode([
        'success' => true,
        'message' => 'Interview invitation email sent successfully',
        'recipient' => $to_email
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please check your server email configuration.'
    ]);
}
?>