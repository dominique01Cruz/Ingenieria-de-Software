<?php
require_once 'connection.php';
require_once 'users.php';

// Handle API requests
function route_request() {
    $action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : null);

    if ($action) {
        header('Content-Type: application/json');
        
        // Acciones que no requieren autenticación
        $public_actions = ['initialize_db', 'login', 'check_session', 'check_permission'];
        
        // Verificar sesión para acciones protegidas
        if (!in_array($action, $public_actions) && !is_logged_in()) {
            echo json_encode(['success' => false, 'message' => 'Authentication required', 'error_code' => 'AUTH_REQUIRED']);
            exit;
        }
        
        switch ($action) {
            case 'initialize_db':
                echo json_encode(initialize_db());
                break;
                
            case 'login':
                $userData = json_decode(file_get_contents('php://input'), true);
                $username = isset($userData['username']) ? $userData['username'] : null;
                $password = isset($userData['password']) ? $userData['password'] : null;
                echo json_encode(login($username, $password));
                break;
                
            case 'logout':
                echo json_encode(logout());
                break;
                
            case 'check_session':
                echo json_encode(get_session_info());
                break;
                
            case 'check_permission':
                $requiredLevel = isset($_GET['level']) ? intval($_GET['level']) : 4;
                $hasPermission = check_permission($requiredLevel);
                echo json_encode([
                    'success' => true, 
                    'data' => ['has_permission' => $hasPermission]
                ]);
                break;
                
            case 'get_users':
                // Todos los usuarios pueden ver la lista, los detalles se filtran en el frontend
                echo json_encode(get_users());
                break;
                
            case 'get_user':
                $id = isset($_GET['id']) ? $_GET['id'] : null;
                
                // Si no es un admin y está pidiendo datos de otro usuario, denegar
                if (!check_permission(1) && $_SESSION['user_id'] != $id) {
                    echo json_encode(['success' => false, 'message' => 'Permission denied', 'error_code' => 'PERMISSION_DENIED']);
                    break;
                }
                
                echo json_encode(get_user($id));
                break;
                
            case 'add_user':
                // Solo administradores pueden crear usuarios
                if (!check_permission(1)) {
                    echo json_encode(['success' => false, 'message' => 'Permission denied', 'error_code' => 'PERMISSION_DENIED']);
                    break;
                }
                
                $userData = json_decode(file_get_contents('php://input'), true);
                echo json_encode(add_user($userData));
                break;
                
            case 'update_user':
                $userData = json_decode(file_get_contents('php://input'), true);
                
                // Si no es administrador y está intentando editar otro usuario, denegar
                if (!check_permission(1) && $_SESSION['user_id'] != $userData['id']) {
                    echo json_encode(['success' => false, 'message' => 'Permission denied', 'error_code' => 'PERMISSION_DENIED']);
                    break;
                }
                
                // Si no es administrador y está intentando cambiar su propio tipo de usuario, denegar
                if (!check_permission(1) && $_SESSION['user_id'] == $userData['id'] && 
                    isset($userData['user_type']) && $_SESSION['user_type'] != $userData['user_type']) {
                    echo json_encode(['success' => false, 'message' => 'Cannot change your own user type', 'error_code' => 'PERMISSION_DENIED']);
                    break;
                }
                
                echo json_encode(update_user($userData));
                break;
                
            case 'delete_user':
                // Solo administradores pueden eliminar usuarios
                if (!check_permission(1)) {
                    echo json_encode(['success' => false, 'message' => 'Permission denied', 'error_code' => 'PERMISSION_DENIED']);
                    break;
                }
                
                $id = json_decode(file_get_contents('php://input'), true)['id'] ?? null;
                echo json_encode(delete_user($id));
                break;
                
            case 'get_user_types':
                echo json_encode(get_user_types());
                break;
                
            default:
                echo json_encode(['success' => false, 'message' => 'Invalid action']);
        }
        exit;
    }
}

// Call the router
route_request(); 