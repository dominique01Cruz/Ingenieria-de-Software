<?php
require_once 'connection.php';

// Iniciar sesión si no está iniciada
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Mapa de niveles de permisos por rol
$PERMISSION_LEVELS = [
    'administrador' => 1, // Nivel más alto
    'contador' => 2,
    'vendedor' => 3,
    'invitado' => 4  // Nivel más bajo
];

// User functions
function get_users() {
    $conn = connect_db();
    if (!$conn) return ["success" => false, "message" => "Error connecting to database"];
    
    try {
        $stmt = $conn->prepare("SELECT * FROM users");
        $stmt->execute();
        
        return [
            "success" => true, 
            "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ];
    } catch(PDOException $e) {
        return ["success" => false, "message" => "Error fetching users: " . $e->getMessage()];
    }
}

function get_user($id) {
    $conn = connect_db();
    if (!$conn) return ["success" => false, "message" => "Error connecting to database"];
    
    try {
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            return ["success" => false, "message" => "User not found"];
        }
        
        return [
            "success" => true, 
            "data" => $user
        ];
    } catch(PDOException $e) {
        return ["success" => false, "message" => "Error fetching user: " . $e->getMessage()];
    }
}

function login($username, $password) {
    $conn = connect_db();
    if (!$conn) return ["success" => false, "message" => "Error connecting to database"];
    
    try {
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && $user['password'] === $password) { // In a real app, use password_verify()
            // Iniciar sesión y almacenar datos del usuario
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['login_time'] = time();
            
            // Regenerar ID de sesión por seguridad
            session_regenerate_id(true);
            
            return ["success" => true, "data" => $user];
        } else {
            return ["success" => false, "message" => "Invalid username or password"];
        }
    } catch(PDOException $e) {
        return ["success" => false, "message" => "Error during login: " . $e->getMessage()];
    }
}

/**
 * Verifica si el usuario tiene el nivel de permiso requerido
 * @param int $requiredLevel Nivel requerido (1: admin, 2: contador, 3: vendedor, 4: invitado)
 * @return bool True si tiene permiso, False si no
 */
function check_permission($requiredLevel) {
    global $PERMISSION_LEVELS;
    
    // Si no hay sesión activa, no tiene permiso
    if (!isset($_SESSION['user_type'])) {
        return false;
    }
    
    $userRole = $_SESSION['user_type'];
    $userLevel = $PERMISSION_LEVELS[$userRole] ?? 4; // Por defecto, invitado
    
    // El usuario tiene permiso si su nivel es menor o igual al requerido
    // (niveles más bajos = más privilegios)
    return $userLevel <= $requiredLevel;
}

/**
 * Verifica si hay una sesión activa
 * @return bool True si hay sesión, False si no
 */
function is_logged_in() {
    return isset($_SESSION['user_id']);
}

/**
 * Cierra la sesión del usuario
 * @return array Resultado de la operación
 */
function logout() {
    // Limpiar variables de sesión
    $_SESSION = array();
    
    // Destruir la cookie de sesión
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // Destruir la sesión
    session_destroy();
    
    return ["success" => true, "message" => "Logout successful"];
}

function add_user($user_data) {
    $conn = connect_db();
    if (!$conn) return ["success" => false, "message" => "Error connecting to database"];
    
    try {
        // Check if username already exists
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->bindParam(':username', $user_data['username']);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            return ["success" => false, "message" => "Username already exists"];
        }
        
        $stmt = $conn->prepare("INSERT INTO users (username, password, name, user_type) VALUES (:username, :password, :name, :user_type)");
        $stmt->bindParam(':username', $user_data['username']);
        $stmt->bindParam(':password', $user_data['password']); // In a real app, use password_hash()
        $stmt->bindParam(':name', $user_data['name']);
        
        // Set user_type, default to 'invitado' if not provided
        $user_type = isset($user_data['user_type']) ? $user_data['user_type'] : 'invitado';
        $stmt->bindParam(':user_type', $user_type);
        
        $stmt->execute();
        
        return [
            "success" => true, 
            "message" => "User added successfully",
            "id" => $conn->lastInsertId()
        ];
    } catch(PDOException $e) {
        return ["success" => false, "message" => "Error adding user: " . $e->getMessage()];
    }
}

function update_user($user_data) {
    $conn = connect_db();
    if (!$conn) return ["success" => false, "message" => "Error connecting to database"];
    
    try {
        // Check if username already exists (except for this user)
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username AND id != :id");
        $stmt->bindParam(':username', $user_data['username']);
        $stmt->bindParam(':id', $user_data['id']);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            return ["success" => false, "message" => "Username already exists"];
        }
        
        // Update with or without password
        if (isset($user_data['password']) && !empty($user_data['password'])) {
            $stmt = $conn->prepare("UPDATE users SET username = :username, password = :password, name = :name, user_type = :user_type WHERE id = :id");
            $stmt->bindParam(':password', $user_data['password']); // In a real app, use password_hash()
        } else {
            $stmt = $conn->prepare("UPDATE users SET username = :username, name = :name, user_type = :user_type WHERE id = :id");
        }
        
        $stmt->bindParam(':id', $user_data['id']);
        $stmt->bindParam(':username', $user_data['username']);
        $stmt->bindParam(':name', $user_data['name']);
        
        // Set user_type, default to current value if not provided
        $user_type = isset($user_data['user_type']) ? $user_data['user_type'] : 'invitado';
        $stmt->bindParam(':user_type', $user_type);
        
        $stmt->execute();
        
        // Si el usuario actualizó su propio perfil, actualizar también los datos de sesión
        if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $user_data['id']) {
            $_SESSION['username'] = $user_data['username'];
            $_SESSION['name'] = $user_data['name'];
            $_SESSION['user_type'] = $user_type;
        }
        
        return ["success" => true, "message" => "User updated successfully"];
    } catch(PDOException $e) {
        return ["success" => false, "message" => "Error updating user: " . $e->getMessage()];
    }
}

function delete_user($id) {
    $conn = connect_db();
    if (!$conn) return ["success" => false, "message" => "Error connecting to database"];
    
    try {
        // Check if this is the last user
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users");
        $stmt->execute();
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        if ($count <= 1) {
            return ["success" => false, "message" => "Cannot delete the last user"];
        }
        
        // No permitir que un usuario se elimine a sí mismo
        if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $id) {
            return ["success" => false, "message" => "Cannot delete your own account"];
        }
        
        $stmt = $conn->prepare("DELETE FROM users WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return ["success" => true, "message" => "User deleted successfully"];
    } catch(PDOException $e) {
        return ["success" => false, "message" => "Error deleting user: " . $e->getMessage()];
    }
}

// Get all available user types
function get_user_types() {
    $userTypes = ['administrador', 'contador', 'vendedor', 'invitado'];
    return [
        "success" => true,
        "data" => $userTypes
    ];
}

// Get session info for the client
function get_session_info() {
    if (!isset($_SESSION['user_id'])) {
        return ["success" => false, "message" => "No active session"];
    }
    
    return [
        "success" => true,
        "data" => [
            "user_id" => $_SESSION['user_id'],
            "username" => $_SESSION['username'],
            "name" => $_SESSION['name'],
            "user_type" => $_SESSION['user_type'],
            "login_time" => $_SESSION['login_time']
        ]
    ];
} 