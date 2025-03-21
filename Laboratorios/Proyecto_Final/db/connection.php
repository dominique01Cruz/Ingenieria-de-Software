<?php
// Database configuration
$host = 'localhost';
$db_name = 'facturacion';
$username = 'root';
$password = ''; // Change this to your database password if you have one

// Create connection
function connect_db() {
    global $host, $db_name, $username, $password;
    
    try {
        $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
        // Set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->exec("SET NAMES utf8");
        return $conn;
    } catch(PDOException $e) {
        return false;
    }
}

// Function to check if tables exist, if not create them
function initialize_db() {
    $conn = connect_db();
    if (!$conn) return ["success" => false, "message" => "Error connecting to database"];
    
    try {
        // Check if tables exist
        $stmt = $conn->prepare("SHOW TABLES LIKE 'users'");
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            return ["success" => true, "message" => "Database already initialized"];
        }
        
        // Read SQL file and execute
        $sql = file_get_contents(__DIR__ . '/schema.sql');
        $conn->exec($sql);
        
        return ["success" => true, "message" => "Database initialized successfully"];
    } catch(PDOException $e) {
        return ["success" => false, "message" => "Error initializing database: " . $e->getMessage()];
    }
} 