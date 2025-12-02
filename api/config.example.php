<?php
// api/config.php - EXAMPLE FILE
// Copy this to config.php and fill in your credentials

// CORS Headers - Allow Vercel frontend
header('Access-Control-Allow-Origin: https://app.tasu.ai');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database Configuration (MySQL - Hostinger)
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');

// Firebase Configuration
define('FIREBASE_PROJECT_ID', 'tasu-44e26');
define('FIREBASE_WEB_API_KEY', 'YOUR_FIREBASE_WEB_API_KEY');

// Tinybird Configuration
define('TINYBIRD_HOST', 'https://api.eu-west-1.aws.tinybird.co');
define('TINYBIRD_ADMIN_TOKEN', 'YOUR_TINYBIRD_ADMIN_TOKEN');
define('TINYBIRD_INGEST_TOKEN', 'YOUR_TINYBIRD_INGEST_TOKEN');

// Stripe Configuration (Optional - for billing)
define('STRIPE_SECRET_KEY', 'YOUR_STRIPE_SECRET_KEY');
define('STRIPE_PUBLISHABLE_KEY', 'YOUR_STRIPE_PUBLISHABLE_KEY');
?>