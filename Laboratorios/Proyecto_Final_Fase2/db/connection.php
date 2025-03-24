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
        // Primero intentamos conectar sin seleccionar una base de datos
        $conn = new PDO("mysql:host=$host", $username, $password);
        
        // Set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->exec("SET NAMES utf8");
        
        // Verificar si la base de datos existe
        $result = $conn->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$db_name'");
        
        if($result->rowCount() > 0) {
            // Si existe, nos conectamos a ella
            $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conn->exec("SET NAMES utf8");
            return $conn;
        } else {
            // Si no existe, intentamos crearla
            $conn->exec("CREATE DATABASE IF NOT EXISTS `$db_name`");
            
            // Y luego nos conectamos a ella
            $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conn->exec("SET NAMES utf8");
            return $conn;
        }
    } catch(PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        return false;
    }
}

// Function to check if tables exist, if not create them
function initialize_db() {
    $conn = connect_db();
    if (!$conn) return ["status" => "error", "message" => "Error connecting to database. Please check MySQL server is running."];
    
    try {
        // Check if tables exist
        $stmt = $conn->prepare("SHOW TABLES LIKE 'users'");
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            return ["status" => "success", "message" => "Database already initialized"];
        }
        
        // Read SQL file and execute
        $sqlFile = __DIR__ . '/schema.sql';
        
        if (!file_exists($sqlFile)) {
            return ["status" => "error", "message" => "SQL schema file not found: " . $sqlFile];
        }
        
        $sql = file_get_contents($sqlFile);
        
        if (empty($sql)) {
            return ["status" => "error", "message" => "SQL schema file is empty"];
        }
        
        // Ejecutar cada instrucción SQL por separado
        $queries = explode(';', $sql);
        
        foreach ($queries as $query) {
            $query = trim($query);
            if (!empty($query) && strpos($query, 'drop database') === false) {
                try {
                    $conn->exec($query);
                } catch(PDOException $ex) {
                    // Ignorar errores específicos como "database already exists"
                    if(strpos($ex->getMessage(), '1007') === false) {
                        throw $ex;
                    }
                }
            }
        }
        
        return ["status" => "success", "message" => "Database initialized successfully"];
    } catch(PDOException $e) {
        error_log("Database initialization error: " . $e->getMessage());
        return ["status" => "error", "message" => "Error initializing database: " . $e->getMessage()];
    }
} 