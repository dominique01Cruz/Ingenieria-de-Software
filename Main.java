package Lab_1;

public class Main {
    public static void main(String[] args) {
        // Instancia de números complejos
        Complex c1 = new Complex(3, 4);
        Complex c2 = new Complex(1, 2);

        // Operaciones básicas
        System.out.println("Números complejos:");
        System.out.println("c1: " + c1);
        System.out.println("c2: " + c2);

        System.out.println("\nOperaciones:");
        System.out.println("Suma: " + c1.addition(c2));
        System.out.println("Resta: " + c1.subtraction(c2));
        System.out.println("Multiplicación: " + c1.multiplication(c2));
        System.out.println("División: " + c1.division(c2));

        // Otras operaciones
        System.out.println("\nOtras operaciones con c1:");
        System.out.println("Conjugado: " + c1.conjugate());
        System.out.println("Módulo: " + c1.module());
        System.out.println("Fase: " + c1.phase());
        System.out.println("Potencia (cuadrado): " + c1.power(2));
        System.out.println("Raíz cuadrada: " + c1.squareRoot());
        System.out.println("Logaritmo: " + c1.logarithm());

        // Conversión de String a Complejo
        Complex c3 = Complex.toComplex("5 + 6i");
        System.out.println("\nNúmero complejo desde String: " + c3);
        System.out.println("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
        System.out.println("Cruz Grimaldez Manuel Dominique");
        System.out.println("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    }
}
