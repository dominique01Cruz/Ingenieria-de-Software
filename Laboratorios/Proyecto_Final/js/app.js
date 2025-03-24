// User class
class User {
  constructor(id, username, password, name, userType) {
    this.id = id;
    this.username = username;
    this.password = password; // In a real app, this would be hashed
    this.name = name;
    this.userType = userType || "invitado";
  }

  validatePassword(password) {
    return this.password === password;
  }

  // Verificar si el usuario tiene un nivel de permiso específico
  hasPermission(requiredLevel) {
    const permissionLevels = {
      administrador: 1, // Nivel más alto
      contador: 2,
      vendedor: 3,
      invitado: 4, // Nivel más bajo
    };

    const userLevel = permissionLevels[this.userType] || 4;
    return userLevel <= requiredLevel;
  }
}

// User Controller class
class UserController {
  constructor() {
    this.users = [];
    this.userTypes = ["administrador", "contador", "vendedor", "invitado"]; // Valores predeterminados
    this.currentUser = null;
    this.loadUserTypes();

    // Inicializar el selector de tipos de usuario inmediatamente
    this.initializeUserTypeSelect();
  }

  // Inicializar el selector de tipos de usuario con valores predeterminados
  initializeUserTypeSelect() {
    const userTypeSelect = document.getElementById("userType");
    if (userTypeSelect) {
      userTypeSelect.innerHTML = this.generateUserTypeOptions();
    }
  }

  // Cargar tipos de usuario disponibles
  async loadUserTypes() {
    try {
      const response = await apiService.getUserTypes();
      if (response.success) {
        this.userTypes = response.data;
        // Actualizar el selector después de cargar los datos
        const userTypeSelect = document.getElementById("userType");
        if (userTypeSelect) {
          userTypeSelect.innerHTML = this.generateUserTypeOptions();
        }
      } else {
        console.error("Error al cargar tipos de usuario:", response.message);
      }
    } catch (error) {
      console.error("Error al cargar tipos de usuario:", error);
    }
  }

  // Verificar si hay una sesión activa
  async checkSession() {
    try {
      const response = await apiService.checkSession();
      if (response.success) {
        this.currentUser = new User(
          response.data.user_id,
          response.data.username,
          "", // No se envía la contraseña por seguridad
          response.data.name,
          response.data.user_type
        );
        return this.currentUser;
      } else {
        this.currentUser = null;
        return null;
      }
    } catch (error) {
      console.error("Error al verificar sesión:", error);
      this.currentUser = null;
      return null;
    }
  }

  // Verificar permisos del usuario actual
  hasPermission(level) {
    if (!this.currentUser) return false;
    return this.currentUser.hasPermission(level);
  }

  // Cargar usuarios desde la base de datos usando la API
  async loadUsersFromDB() {
    try {
      const response = await apiService.getUsers();
      if (response.success) {
        this.users = response.data.map(
          (u) =>
            new User(
              parseInt(u.id),
              u.username,
              u.password,
              u.name,
              u.user_type
            )
        );
        this.renderUsers();
      } else {
        console.error("Error al cargar usuarios:", response.message);
        // Si se deniega el permiso, mostrar mensaje apropiado
        if (response.error_code === "PERMISSION_DENIED") {
          const tableBody = document.getElementById("userTableBody");
          if (tableBody) {
            tableBody.innerHTML =
              '<tr><td colspan="5" class="error-message">No tienes permiso para ver la lista de usuarios.</td></tr>';
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }

  async addUser(username, password, name, userType) {
    try {
      const response = await apiService.addUser(
        username,
        password,
        name,
        userType
      );
      if (response.success) {
        // Recargar usuarios para obtener el nuevo usuario con su ID
        await this.loadUsersFromDB();
        return true;
      } else {
        console.error("Error al agregar usuario:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      return false;
    }
  }

  async editUser(id, username, password, name, userType) {
    try {
      const response = await apiService.updateUser(
        id,
        username,
        password,
        name,
        userType
      );
      if (response.success) {
        // Recargar usuarios para obtener datos actualizados
        await this.loadUsersFromDB();
        // Si el usuario actualizó su propio perfil, actualizar también currentUser
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser.username = username;
          this.currentUser.name = name;
          if (userType !== this.currentUser.userType) {
            this.currentUser.userType = userType;
            // Recargar la página para aplicar nuevos permisos
            location.reload();
          }
        }
        return true;
      } else {
        console.error("Error al actualizar usuario:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return false;
    }
  }

  async deleteUser(id) {
    try {
      // Verificar que no sea el último usuario
      if (this.users.length <= 1) {
        alert("No puedes eliminar el último usuario.");
        return false;
      }

      const response = await apiService.deleteUser(id);
      if (response.success) {
        // Recargar usuarios para reflejar la eliminación
        await this.loadUsersFromDB();
        return true;
      } else {
        alert("Error al eliminar usuario: " + response.message);
        return false;
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return false;
    }
  }

  renderUsers() {
    const tableBody = document.getElementById("userTableBody");
    if (!tableBody) return; // Tabla no disponible en esta vista

    tableBody.innerHTML = "";

    // Modificar encabezados de tabla según permisos
    const tableHead = document.querySelector("table thead tr");
    if (tableHead) {
      // Si el usuario es invitado, solo mostrar la columna de nombre y acciones
      if (this.currentUser && this.currentUser.userType === "invitado") {
        tableHead.innerHTML = `
          <th>Nombre</th>
          <th>Acciones</th>
        `;
      } else {
        // Para otros usuarios mostrar todas las columnas
        tableHead.innerHTML = `
          <th>ID</th>
          <th>Usuario</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Acciones</th>
        `;
      }
    }

    // Determinar si el usuario actual es invitado
    const isCurrentUserInvitado =
      this.currentUser && this.currentUser.userType === "invitado";

    this.users.forEach((user) => {
      const row = document.createElement("tr");

      // Si el usuario actual no es administrador, limitar acciones disponibles
      let actionsHtml = "";
      if (this.hasPermission(1)) {
        // Administrador
        actionsHtml = `
          <button class="edit-btn" onclick="editUser(${user.id})">Editar</button>
          <button onclick="deleteUser(${user.id})">Eliminar</button>
        `;
      } else if (this.currentUser && this.currentUser.id === user.id) {
        // El usuario puede editar su propio perfil
        actionsHtml = `
          <button class="edit-btn" onclick="editUser(${user.id})">Editar perfil</button>
        `;
      }

      // Contenido de fila según nivel de permiso
      if (isCurrentUserInvitado) {
        // Invitados solo ven nombre y acciones (si es su propio perfil)
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${actionsHtml}</td>
        `;
      } else {
        // Otros usuarios ven toda la información
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.name}</td>
          <td>${user.userType}</td>
          <td>${actionsHtml}</td>
        `;
      }

      tableBody.appendChild(row);
    });

    // Actualizar UI basada en permisos
    this.updateUIBasedOnPermissions();
  }

  // Actualizar elementos de la UI basados en los permisos del usuario
  updateUIBasedOnPermissions() {
    const addUserForm = document.getElementById("userForm");
    const formTitle = document.getElementById("formTitle");

    if (addUserForm) {
      // Verificar si hay un usuario seleccionado para editar
      const isEditingUser = document.getElementById("userId").value !== "";

      // Solo administradores pueden agregar nuevos usuarios
      if (!this.hasPermission(1)) {
        // Cambiar el título según si está editando o no
        formTitle.textContent = isEditingUser
          ? "Editar mi perfil"
          : "Mi perfil";

        // Esconder formulario si no es administrador y no hay usuario seleccionado
        addUserForm.style.display = isEditingUser ? "block" : "none";
      } else {
        formTitle.textContent = isEditingUser
          ? "Editar Usuario"
          : "Añadir Usuario";
        addUserForm.style.display = "block";
      }

      // El campo de tipo de usuario solo es editable por administradores
      const userTypeField = document.getElementById("userType");
      const userTypeLabel = document.querySelector('label[for="userType"]');

      if (userTypeField && userTypeLabel) {
        const isAdmin = this.hasPermission(1);
        userTypeField.disabled = !isAdmin;
        userTypeLabel.parentElement.style.opacity = isAdmin ? "1" : "0.7";
      }
    }
  }

  // Generar el HTML del select para los tipos de usuario
  generateUserTypeOptions(selectedType = "") {
    let options = "";
    this.userTypes.forEach((type) => {
      const selected = type === selectedType ? "selected" : "";
      options += `<option value="${type}" ${selected}>${
        type.charAt(0).toUpperCase() + type.slice(1)
      }</option>`;
    });
    return options;
  }

  async validateLoginDB(username, password) {
    try {
      const response = await apiService.login(username, password);
      if (response.success) {
        // Actualizar usuario actual
        this.currentUser = new User(
          response.data.id,
          response.data.username,
          "",
          response.data.name,
          response.data.user_type
        );
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error durante el login:", error);
      return null;
    }
  }

  async logout() {
    try {
      const response = await apiService.logout();
      this.currentUser = null;
      return response.success;
    } catch (error) {
      console.error("Error durante logout:", error);
      return false;
    }
  }
}

// App Controller - Main application logic
class AppController {
  constructor() {
    this.userController = new UserController();
    // Comprobar si estamos en la página principal
    if (document.getElementById("loginForm")) {
      // Primero comprobar si ya hay una sesión activa
      this.checkSession().then((user) => {
        if (user) {
          this.showApp(user);
        } else {
          this.setupLoginEvents();
          this.showLogin();
        }
      });
    }
  }

  // Comprobar si hay una sesión activa
  async checkSession() {
    const user = await this.userController.checkSession();
    if (user) {
      await this.userController.loadUsersFromDB();
      this.setupAppEvents();
    }
    return user;
  }

  setupLoginEvents() {
    // Login form
    document
      .getElementById("loginForm")
      .addEventListener("submit", (e) => this.handleLogin(e));
  }

  setupAppEvents() {
    // User form (si existe en esta página)
    const userForm = document.getElementById("userForm");
    if (userForm) {
      userForm.addEventListener("submit", (e) => this.handleUserFormSubmit(e));
      const cancelBtn = document.getElementById("cancelEdit");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => this.resetUserForm());
      }
    }

    // Logout button (si existe en esta página)
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.handleLogout());
    }
  }

  async handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const loginError = document.getElementById("loginError");

    // Autenticación usando la base de datos
    const user = await this.userController.validateLoginDB(username, password);
    if (user) {
      // Cargar usuarios y configurar eventos
      await this.userController.loadUsersFromDB();
      this.setupAppEvents();

      this.showApp(this.userController.currentUser);
      loginError.textContent = "";
    } else {
      loginError.textContent = "Usuario o contraseña incorrectos";
    }
  }

  async handleLogout() {
    const success = await this.userController.logout();
    if (success) {
      this.showLogin();
      document.getElementById("loginForm").reset();
    }
  }

  async handleUserFormSubmit(event) {
    event.preventDefault();
    const id = document.getElementById("userId").value;
    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const userType = document.getElementById("userType").value;
    const passwordError = document.getElementById("passwordError");
    const userMessage = document.getElementById("userMessage");

    // Validate passwords match if provided
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        passwordError.textContent = "Las contraseñas no coinciden";
        return;
      }
      if (password.length < 6) {
        passwordError.textContent =
          "La contraseña debe tener al menos 6 caracteres";
        return;
      }
    }

    passwordError.textContent = "";

    let success = false;
    if (id) {
      // Editing existing user
      const userId = parseInt(id);

      // Verificar si el usuario está editando su propio perfil
      const isOwnProfile =
        this.userController.currentUser &&
        this.userController.currentUser.id === userId;

      // En caso de invitado editando su propio perfil, mantener el tipo de usuario original
      let typeToUse = userType;
      if (
        isOwnProfile &&
        this.userController.currentUser.userType === "invitado"
      ) {
        typeToUse = this.userController.currentUser.userType;
      }

      success = await this.userController.editUser(
        userId,
        username,
        password,
        name,
        typeToUse
      );
      if (success) {
        userMessage.textContent = "Usuario actualizado correctamente";
        userMessage.className = "message success";
        this.resetUserForm();
      } else {
        userMessage.textContent = "Error: No se pudo actualizar el usuario";
        userMessage.className = "message error";
      }
    } else {
      // Adding new user - Solo para administradores
      if (!this.userController.hasPermission(1)) {
        userMessage.textContent = "No tienes permiso para añadir usuarios";
        userMessage.className = "message error";
        setTimeout(() => {
          userMessage.textContent = "";
          userMessage.className = "message";
        }, 3000);
        return;
      }

      if (!password) {
        passwordError.textContent =
          "La contraseña es obligatoria para nuevos usuarios";
        return;
      }
      success = await this.userController.addUser(
        username,
        password,
        name,
        userType
      );
      if (success) {
        userMessage.textContent = "Usuario añadido correctamente";
        userMessage.className = "message success";
        document.getElementById("userForm").reset();
      } else {
        userMessage.textContent = "Error: No se pudo añadir el usuario";
        userMessage.className = "message error";
      }
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      userMessage.textContent = "";
      userMessage.className = "message";
    }, 3000);
  }

  resetUserForm() {
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
    document.getElementById("cancelEdit").style.display = "none";
    document.getElementById("passwordError").textContent = "";

    // Resetear el select de tipo de usuario
    const userTypeSelect = document.getElementById("userType");
    if (userTypeSelect) {
      userTypeSelect.innerHTML = this.userController.generateUserTypeOptions();
      // Si no es admin, el campo estará deshabilitado
      userTypeSelect.disabled = !this.userController.hasPermission(1);
    }

    // Actualizar UI basada en permisos
    this.userController.updateUIBasedOnPermissions();
  }

  showLogin() {
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("appSection").style.display = "none";
  }

  showApp(user) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
    document.getElementById("currentUser").textContent = `Hola, ${user.name}`;
    if (user.userType) {
      document.getElementById(
        "currentUser"
      ).textContent += ` (${user.userType})`;
    }
    this.userController.renderUsers();
  }
}

// Global functions for HTML element access
function editUser(id) {
  const user = app.userController.users.find((u) => u.id === parseInt(id));
  if (user) {
    document.getElementById("userId").value = user.id;
    document.getElementById("username").value = user.username;
    document.getElementById("name").value = user.name;
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";

    // Establecer el tipo de usuario en el select
    const userTypeSelect = document.getElementById("userType");
    if (userTypeSelect) {
      userTypeSelect.innerHTML = app.userController.generateUserTypeOptions(
        user.userType
      );
      // Solo administradores pueden cambiar el tipo de usuario
      userTypeSelect.disabled = !app.userController.hasPermission(1);
    }

    document.getElementById("cancelEdit").style.display = "inline-block";

    // Asegurarse de que el formulario sea visible para usuarios editando su propio perfil
    const userForm = document.getElementById("userForm");
    if (userForm) {
      userForm.style.display = "block";
    }

    // Actualizar la UI basada en permisos después de iniciar la edición
    app.userController.updateUIBasedOnPermissions();

    // Scroll hasta el formulario
    document.querySelector(".card").scrollIntoView({ behavior: "smooth" });
  }
}

function deleteUser(id) {
  // Verificar permisos
  if (!app.userController.hasPermission(1)) {
    alert("No tienes permiso para eliminar usuarios");
    return;
  }

  if (confirm("¿Estás seguro de eliminar este usuario?")) {
    app.userController.deleteUser(id);
  }
}

// Conexión con la base de datos
class ApiService {
  constructor() {
    this.baseUrl = "db/router.php"; // Cambiado de api.php a db/router.php
  }

  async fetchApi(endpoint, method = "GET", data = null) {
    try {
      const url = endpoint.startsWith("http")
        ? endpoint
        : endpoint.includes("?")
        ? endpoint
        : `${this.baseUrl}?${new URLSearchParams(endpoint).toString()}`;

      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin", // Para enviar cookies de sesión
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const result = await response.json();

      // Convertir el formato de respuesta al formato interno
      return {
        success: result.status === "success",
        data: result.users || result.user || result.message || result,
        message: result.message || "",
        error_code: result.code || "",
      };
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        message: error.message || "Error de red",
        error_code: "NETWORK_ERROR",
      };
    }
  }

  // Comprobar si hay una sesión activa
  checkSession() {
    return this.fetchApi(`${this.baseUrl}?action=check_session`);
  }

  // Comprobar si el usuario tiene un nivel de permiso específico
  checkPermission(level) {
    return this.fetchApi(
      `${this.baseUrl}?action=check_permission&level=${level}`
    );
  }

  // Cerrar sesión
  logout() {
    return this.fetchApi(`${this.baseUrl}?action=logout`);
  }

  // Obtener los tipos de usuario disponibles
  getUserTypes() {
    return this.fetchApi(`${this.baseUrl}?action=get_user_types`);
  }

  // Iniciar sesión
  login(username, password) {
    return this.fetchApi(`${this.baseUrl}?action=login`, "POST", {
      username,
      password,
    });
  }

  // Obtener todos los usuarios
  getUsers() {
    return this.fetchApi(`${this.baseUrl}?action=get_users`);
  }

  // Agregar un nuevo usuario
  addUser(username, password, name, userType) {
    return this.fetchApi(`${this.baseUrl}?action=add_user`, "POST", {
      username,
      password,
      name,
      user_type: userType,
    });
  }

  // Actualizar un usuario existente
  updateUser(id, username, password, name, userType) {
    return this.fetchApi(`${this.baseUrl}?action=update_user`, "POST", {
      id,
      username,
      password,
      name,
      user_type: userType,
    });
  }

  // Eliminar un usuario
  deleteUser(id) {
    return this.fetchApi(`${this.baseUrl}?action=delete_user`, "POST", { id });
  }
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar el API Service
  window.apiService = new ApiService();

  // Inicializar la aplicación
  window.app = new AppController();
});
