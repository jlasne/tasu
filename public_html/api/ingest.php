<?php
// api/ingest.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'config.php';

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Add server timestamp
$data['timestamp'] = date('Y-m-d H:i:s');

// Prepare NDJSON for Tinybird
$ndjson = json_encode($data);

// Send to Tinybird
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, TINYBIRD_HOST . "/v0/events?name=events");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $ndjson);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . TINYBIRD_ADMIN_TOKEN,
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($http_code);
echo $response;
?>