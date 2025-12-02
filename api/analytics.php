<?php
// api/analytics.php
require_once 'auth.php';
require_once 'db.php';

// 1. Verify Authentication
$token = getBearerToken();
$user = verifyFirebaseToken($token);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// 2. Get User's Project ID
$stmt = $pdo->prepare("SELECT project_id FROM users WHERE firebase_uid = ?");
$stmt->execute([$user['localId']]);
$userData = $stmt->fetch();

if (!$userData) {
    // User not found in DB (should have called register.php first)
    http_response_code(403);
    echo json_encode(['error' => 'User not registered']);
    exit;
}

$project_id = $userData['project_id'];

// 3. Fetch Data from Tinybird
$period = $_GET['period'] ?? '7';
$isRealtime = isset($_GET['realtime']) && $_GET['realtime'] === 'true';

// Calculate days
$days = 7;
if ($period === '30')
    $days = 30;
elseif ($period === '90')
    $days = 90;
elseif ($period === 'all')
    $days = 3650;

if ($isRealtime) {
    $url = TINYBIRD_HOST . "/v0/pipes/recent_clicks.json?project_id=" . urlencode($project_id) . "&limit=10";
} else {
    $url = TINYBIRD_HOST . "/v0/pipes/top_features.json?project_id=" . urlencode($project_id) . "&days=" . $days . "&limit=100";
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . TINYBIRD_ADMIN_TOKEN
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    http_response_code($http_code);
    echo json_encode(['error' => 'Analytics error']);
    exit;
}

$data = json_decode($response, true);

if ($isRealtime) {
    echo json_encode(['recent_clicks' => $data['data'] ?? []]);
} else {
    // Format for dashboard
    $buttons = [];
    if (isset($data['data']) && is_array($data['data'])) {
        foreach ($data['data'] as $row) {
            $buttons[] = [
                'name' => $row['feature_name'] ?? 'Unknown',
                'selector' => $row['selector'] ?? 'Unknown',
                'page' => $row['page'] ?? 'Unknown',
                'clicks' => intval($row['clicks'] ?? 0),
                'unique_users' => intval($row['unique_users'] ?? 0)
            ];
        }
    }
    echo json_encode(['buttons' => $buttons]);
}
?>