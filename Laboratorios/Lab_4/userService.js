const User = require("./user");

class UserService {
  constructor() {
    this.userList = [];
    this.generateRandomUsers(3); // Genera 3 usuarios aleatorios para iniciar
  }

  generateRandomUsers(count) {
    for (let i = 0; i < count; i++) {
      const id = i + 1;
      const username = `user${id}`;
      const password = Math.random().toString(36).slice(-8);
      const email = `user${id}@example.com`; // Email generado
      const role = i % 2 === 0 ? "admin" : "user"; // Alternando entre "admin" y "user"
      this.addUser(new User(id, username, password, email, role));
    }
  }

  getUsers() {
    return this.userList;
  }

  addUser(user) {
    this.userList.push(user);
    return user;
  }

  editUser(id, updatedUser) {
    const index = this.userList.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.userList[index] = {
        ...this.userList[index],
        username: updatedUser.username || this.userList[index].username,
        password: updatedUser.password || this.userList[index].password,
        email: updatedUser.email || this.userList[index].email,
        role: updatedUser.role || this.userList[index].role,
      };
      return true;
    }
    return false;
  }

  deleteUser(id) {
    const initialLength = this.userList.length;
    this.userList = this.userList.filter((user) => user.id !== id);
    return this.userList.length !== initialLength;
  }
}

module.exports = UserService;
