# Sistema de Gestión de Usuarios

Sistema simple para gestión de usuarios con autenticación y operaciones CRUD.

## Características

- Sistema de login con usuario y contraseña
- Gestión de usuarios (crear, editar, eliminar)
- Interfaz responsive y moderna
- Almacenamiento en MySQL

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
Proyecto_Final/
├── api.php              # Punto de entrada principal para la API
├── db/                  # Carpeta con todas las funciones de base de datos
│   ├── connection.php   # Conexión a la base de datos
│   ├── users.php        # Funciones para gestión de usuarios
│   ├── router.php       # Enrutador de peticiones API
│   ├── schema.sql       # Esquema de la base de datos
│   └── README.md        # Documentación sobre la estructura de la BD
├── css/
│   └── styles.css       # Estilos de la aplicación
├── js/
│   └── app.js           # Lógica de la aplicación en JavaScript
└── index.html           # Página principal
```

## Instrucciones de Instalación

1. Clonar o descargar este repositorio
2. Colocar los archivos en un servidor web con PHP (ej. XAMPP, WAMP)
3. Asegurarse de tener MySQL funcionando
4. Abrir el navegador y acceder a la aplicación
5. El sistema creará automáticamente la base de datos y las tablas necesarias

## Credenciales por Defecto

- **Usuario**: admin
- **Contraseña**: admin123

## Requisitos del Sistema

- PHP 7.0 o superior
- MySQL 5.6 o superior
- Navegador web moderno (Chrome, Firefox, Edge, etc.)
