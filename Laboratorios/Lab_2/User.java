package Lab_2;

public class User {
    private int id;
    private String username;
    private String password;
    private String name;
    private String lastEntry;
    private String status;

    // Constructor con 6 parámetros
    public User(int id, String username, String password, String name, String lastEntry, String status) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.lastEntry = lastEntry;
        this.status = status;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastEntry() {
        return lastEntry;
    }

    public void setLastEntry(String lastEntry) {
        this.lastEntry = lastEntry;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", lastEntry='" + lastEntry + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}