class User {
  constructor(id, username, password, email, role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email; // Atributo email
    this.role = role; // Atributo role
  }
}

module.exports = User;
