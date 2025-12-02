<?php
// api/config.php

// Prevent direct access
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    header('HTTP/1.0 403 Forbidden');
    exit;
}

// Tinybird Configuration
define('TINYBIRD_HOST', 'https://api.eu-west-1.aws.tinybird.co');
define('TINYBIRD_ADMIN_TOKEN', 'YOUR_ADMIN_TOKEN_HERE'); // Only for backend use
define('TINYBIRD_INGEST_TOKEN', 'YOUR_INGEST_TOKEN_HERE'); // Write-only token for SDK

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'YOUR_DB_NAME');
define('DB_USER', 'YOUR_DB_USER');
define('DB_PASS', 'YOUR_DB_PASSWORD');

// Stripe Configuration
define('STRIPE_SECRET_KEY', 'sk_test_your_stripe_secret_key');
define('STRIPE_PUBLISHABLE_KEY', 'pk_test_your_stripe_publishable_key');

// Firebase Configuration
define('FIREBASE_PROJECT_ID', 'YOUR_PROJECT_ID');
define('FIREBASE_API_KEY', 'YOUR_API_KEY');
define('FIREBASE_AUTH_DOMAIN', 'YOUR_PROJECT_ID.firebaseapp.com');
define('FIREBASE_STORAGE_BUCKET', 'YOUR_PROJECT_ID.firebasestorage.app');
define('FIREBASE_MESSAGING_SENDER_ID', 'YOUR_SENDER_ID');
define('FIREBASE_APP_ID', 'YOUR_APP_ID');

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
?>