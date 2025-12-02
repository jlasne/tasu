<?php
// api/register.php
require_once 'auth.php';
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$token = getBearerToken();
$user = verifyFirebaseToken($token);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$uid = $user['localId'];
$email = $user['email'];

// Check if user exists
$stmt = $pdo->prepare("SELECT project_id FROM users WHERE firebase_uid = ?");
$stmt->execute([$uid]);
$existing = $stmt->fetch();

if ($existing) {
    echo json_encode(['project_id' => $existing['project_id']]);
    exit;
}

// Create new user with unique project_id
$project_id = 'proj_' . bin2hex(random_bytes(8));

try {
    $stmt = $pdo->prepare("INSERT INTO users (firebase_uid, email, project_id) VALUES (?, ?, ?)");
    $stmt->execute([$uid, $email, $project_id]);
    echo json_encode(['project_id' => $project_id]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Registration failed']);
}
?>