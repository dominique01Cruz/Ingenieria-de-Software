# Sistema de Gestión de Usuarios

Sistema simple para gestión de usuarios con autenticación y operaciones CRUD.

## Ejemplo de Funcionamiento

Imagina que este sistema es como una tienda de juguetes, donde:

- **Recepcionista (router.php)**: Escucha las solicitudes de los clientes y decide qué hacer.
- **Especialista en Juguetes (users.php)**: Sabe todo sobre los juguetes (usuarios) y realiza las acciones necesarias.

### Flujo de Trabajo

1. **Llegada a la Tienda**: Un cliente llega y dice: "Quiero ver todos los juguetes."
2. **Recepcionista**: El recepcionista escucha y dice: "¡Claro! Déjame verificar eso."
3. **Llamada al Especialista**: El recepcionista llama al especialista en juguetes y le dice: "¿Puedes mostrarme todos los juguetes?"
4. **Respuesta del Especialista**: El especialista busca en el almacén y le da al recepcionista la lista de juguetes.
5. **Devolución al Cliente**: El recepcionista le dice al cliente: "Aquí tienes la lista de todos los juguetes."

### Funciones Clave

- **Iniciar Sesión**: Los usuarios pueden iniciar sesión en el sistema. El recepcionista verifica las credenciales y llama al especialista para confirmar la identidad del usuario.
- **Agregar Usuario**: Solo los administradores pueden agregar nuevos usuarios. El recepcionista recibe la solicitud y llama al especialista para que lo registre en la base de datos.
- **Eliminar Usuario**: Los administradores pueden eliminar usuarios. El recepcionista verifica la solicitud y llama al especialista para que realice la eliminación.
- **Ver Usuarios**: Cualquier usuario autenticado puede ver la lista de usuarios. El recepcionista llama al especialista para obtener la información y la devuelve al cliente.

### Ventajas de Este Enfoque

- **Organización**: Separar la lógica de enrutamiento y la lógica de negocio mejora la organización del código.
- **Mantenibilidad**: Facilita el mantenimiento y la actualización del sistema, ya que cada parte tiene una responsabilidad clara.
- **Seguridad**: Permite implementar medidas de seguridad más efectivas al manejar la autenticación y autorización de manera centralizada.

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

1. Clonar o descargar este repositorio.
2. Colocar los archivos en un servidor web con PHP (ej. XAMPP, WAMP).
3. Asegurarse de tener MySQL funcionando.
4. Abrir el navegador y acceder a la aplicación.
5. El sistema creará automáticamente la base de datos y las tablas necesarias.

## Credenciales por Defecto

- **Usuario**: admin
- **Contraseña**: admin123

## Sistema de Roles y Permisos

El sistema implementa cuatro roles de usuario, cada uno con diferentes niveles de acceso:

### 1. Administrador

- **Permisos completos**:
  - Ver todos los usuarios con información detallada
  - Agregar nuevos usuarios
  - Editar cualquier usuario (excepto el ID 1, que es el superadmin)
  - Eliminar usuarios (excepto a sí mismo y el superadmin)
- **Interfaz**: Panel completo de gestión con todas las opciones habilitadas

### 2. Contador

- **Permisos limitados**:
  - Ver nombres de usuarios (información reducida)
  - Agregar nuevos usuarios **solo con rol de contador o invitado**
  - Editar únicamente su propio perfil
  - No puede eliminar usuarios
- **Interfaz**: Panel de contador con formulario oculto, botón "Añadir Usuario" visible

### 3. Vendedor

- **Permisos moderados**:
  - Ver información de usuarios (sin ID ni fecha de creación)
  - Agregar nuevos usuarios **con rol de vendedor, contador o invitado**
  - Editar usuarios (excepto el ID 1, que es el superadmin)
  - No puede eliminar usuarios
- **Interfaz**: Panel de gestión con información relevante y capacidad de edición

### 4. Invitado

- **Permisos mínimos**:
  - Ver únicamente nombres de usuarios (información reducida)
  - Editar solo su propio perfil (nombre y contraseña)
  - No puede cambiar su nombre de usuario ni tipo de usuario
  - No puede agregar ni eliminar usuarios
- **Interfaz**: Panel de usuario simplificado, sin botón "Añadir Usuario"

## Detalles de Implementación

### Vista de Tabla

- **Administrador**: Visualiza todos los campos (ID, Usuario, Nombre, Tipo, Fecha, Acciones)
- **Vendedor**: Visualiza campos relevantes (Usuario, Nombre, Tipo, Acciones)
- **Contador/Invitado**: Visualizan solo el nombre de los usuarios y tienen acceso a editar su propio perfil

### Formulario de Edición

- Para todos los usuarios, después de guardar o cancelar la edición, el formulario se oculta
- El botón "Añadir Usuario" está disponible para administradores, vendedores y contadores
- Cuando un usuario edita su propio perfil, se actualiza automáticamente su nombre en la barra superior

### Validaciones de Seguridad

- Se realizan comprobaciones de permisos tanto en el cliente como en el servidor
- Los usuarios no pueden forzar acciones no permitidas desde la consola o modificando el código
- Cada acción requiere autenticación y verificación de permisos
- **Control de escalada de privilegios**: Los usuarios solo pueden crear nuevos usuarios con un nivel de permisos igual o inferior al suyo

## Requisitos del Sistema

- PHP 7.0 o superior
- MySQL 5.6 o superior
- Navegador web moderno (Chrome, Firefox, Edge, etc.)
