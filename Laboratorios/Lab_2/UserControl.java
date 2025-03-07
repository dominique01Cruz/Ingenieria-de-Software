package Lab_2;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class UserControl {
    private List<User> userList;
    private Scanner scanner;

    // Constructor
    public UserControl() {
        this.userList = new ArrayList<>();
        this.scanner = new Scanner(System.in);
    }

    // Método para añadir un usuario manualmente
    public void addUser() {
        System.out.println("Ingrese los datos del nuevo usuario:");

        System.out.print("ID: ");
        int id = scanner.nextInt();
        scanner.nextLine(); // Consumir el salto de línea

        System.out.print("Nombre de usuario: ");
        String username = scanner.nextLine();

        System.out.print("Contraseña: ");
        String password = scanner.nextLine();

        System.out.print("Nombre completo: ");
        String name = scanner.nextLine();

        System.out.print("Última entrada (yyyy-MM-dd HH:mm:ss): ");
        String lastEntry = scanner.nextLine();

        System.out.print("Estado (Active/Inactive/Blocked): ");
        String status = scanner.nextLine();

        User newUser = new User(id, username, password, name, lastEntry, status);
        userList.add(newUser);
        System.out.println("Usuario añadido con éxito.");
    }

    // Método para listar todos los usuarios
    public void listUsers() {
        if (userList.isEmpty()) {
            System.out.println("No hay usuarios en la lista.");
        } else {
            for (User user : userList) {
                System.out.println(user);
            }
        }
    }

    // Método para eliminar un usuario por ID
    public void removeUser() {
        System.out.print("Ingrese el ID del usuario a eliminar: ");
        int id = scanner.nextInt();
        scanner.nextLine(); // Consumir el salto de línea

        User userToRemove = null;
        for (User user : userList) {
            if (user.getId() == id) {
                userToRemove = user;
                break;
            }
        }

        if (userToRemove != null) {
            userList.remove(userToRemove);
            System.out.println("Usuario eliminado con éxito.");
        } else {
            System.out.println("No se encontró un usuario con el ID proporcionado.");
        }
    }

    // Método para editar un usuario por ID
    public void editUser() {
        System.out.print("Ingrese el ID del usuario a editar: ");
        int id = scanner.nextInt();
        scanner.nextLine(); // Consumir el salto de línea

        User userToEdit = null;
        for (User user : userList) {
            if (user.getId() == id) {
                userToEdit = user;
                break;
            }
        }

        if (userToEdit != null) {
            System.out.println("Ingrese los nuevos datos del usuario:");

            System.out.print("Nombre de usuario: ");
            userToEdit.setUsername(scanner.nextLine());

            System.out.print("Contraseña: ");
            userToEdit.setPassword(scanner.nextLine());

            System.out.print("Nombre completo: ");
            userToEdit.setName(scanner.nextLine());

            System.out.print("Última entrada (yyyy-MM-dd HH:mm:ss): ");
            userToEdit.setLastEntry(scanner.nextLine());

            System.out.print("Estado (Active/Inactive/Blocked): ");
            userToEdit.setStatus(scanner.nextLine());

            System.out.println("Usuario editado con éxito.");
        } else {
            System.out.println("No se encontró un usuario con el ID proporcionado.");
        }
    }

    // Método principal para probar la funcionalidad
    public static void main(String[] args) {
        UserControl userControl = new UserControl();
        Scanner scanner = new Scanner(System.in);
        int option;

        do {
            System.out.println("\nMenú:");
            System.out.println("1. Añadir usuario");
            System.out.println("2. Listar usuarios");
            System.out.println("3. Eliminar usuario");
            System.out.println("4. Editar usuario");
            System.out.println("0. Salir");
            System.out.print("Seleccione una opción: ");
            option = scanner.nextInt();
            scanner.nextLine(); // Consumir el salto de línea

            switch (option) {
                case 1:
                    userControl.addUser();
                    break;
                case 2:
                    userControl.listUsers();
                    break;
                case 3:
                    userControl.removeUser();
                    break;
                case 4:
                    userControl.editUser();
                    break;
                case 0:
                    System.out.println("Saliendo...");
                    break;
                default:
                    System.out.println("Opción no válida.");
            }
        } while (option != 0);

        scanner.close();
    }
}