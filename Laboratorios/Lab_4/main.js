const express = require("express");
const UserService = require("./userService");
const User = require("./user");

const app = express();
const port = 3000;
app.use(express.json());

const userService = new UserService();

// Endpoint raíz
app.get("/", (req, res) => {
  res.send(
    "Bienvenido a la API de usuarios! Use /api/users para acceder a los recursos"
  );
});

// Endpoint GET: Obtener todos los usuarios
app.get("/api/users", (req, res) => {
  res.json(userService.getUsers());
});

// Endpoint POST: Crear un nuevo usuario
app.post("/api/users", (req, res) => {
  const { id, username, password, email, role } = req.body;
  const newUser = new User(id, username, password, email, role);
  userService.addUser(newUser);
  res.status(201).json(newUser);
});

// Endpoint PUT: Actualizar un usuario existente
app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedUser = req.body;

  if (userService.editUser(id, updatedUser)) {
    res.json({ message: "User updated successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Endpoint DELETE: Eliminar un usuario por su ID
app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (userService.deleteUser(id)) {
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
