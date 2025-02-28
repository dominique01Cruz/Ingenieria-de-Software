package Lab_1;

public class Complex {
    // Atributos
    int real;
    int img;

    // Constructor
    public Complex(int real, int img) {
        this.real = real;
        this.img = img;
    }

    // Método para suma de complejos
    public Complex addition(Complex other) {
        return new Complex(this.real + other.real, this.img + other.img);
    }

    // Método para resta de complejos
    public Complex subtraction(Complex other) {
        return new Complex(this.real - other.real, this.img - other.img);
    }

    // Método para multiplicación de complejos
    public Complex multiplication(Complex other) {
        int realPart = this.real * other.real - this.img * other.img;
        int imgPart = this.real * other.img + this.img * other.real;
        return new Complex(realPart, imgPart);
    }

    // Método para división de complejos
    public Complex division(Complex other) {
        int denom = other.real * other.real + other.img * other.img;
        int realPart = (this.real * other.real + this.img * other.img) / denom;
        int imgPart = (this.img * other.real - this.real * other.img) / denom;
        return new Complex(realPart, imgPart);
    }

    // Método para obtener el conjugado
    public Complex conjugate() {
        return new Complex(this.real, -this.img);
    }

    // Método para obtener el módulo
    public double module() {
        return Math.sqrt(this.real * this.real + this.img * this.img);
    }

    // Método para obtener la fase
    public double phase() {
        return Math.atan2(this.img, this.real);
    }

    // Método para elevar el complejo a una potencia
    public Complex power(int n) {
        double r = this.module();
        double theta = this.phase();
        r = Math.pow(r, n);
        theta = theta * n;
        int realPart = (int) (r * Math.cos(theta));
        int imgPart = (int) (r * Math.sin(theta));
        return new Complex(realPart, imgPart);
    }

    // Método para la raíz cuadrada
    public Complex squareRoot() {
        double r = Math.sqrt(this.module());
        double theta = this.phase() / 2;
        int realPart = (int) (r * Math.cos(theta));
        int imgPart = (int) (r * Math.sin(theta));
        return new Complex(realPart, imgPart);
    }

    // Método para el logaritmo
    public Complex logarithm() {
        double realPart = Math.log(this.module());
        double imgPart = this.phase();
        return new Complex((int) realPart, (int) imgPart);
    }

    // Método toString()
    @Override
    public String toString() {
        return this.real + " + " + this.img + "i";
    }

    // Método para convertir una cadena a un número complejo
    public static Complex toComplex(String cpx) {
        cpx = cpx.replace("i", "").trim();
        String[] parts = cpx.split("\\+|\\-");
        int realPart = Integer.parseInt(parts[0].trim());
        int imgPart = Integer.parseInt(parts[1].trim());
        if (cpx.contains("-")) {
            imgPart = -imgPart;
        }
        return new Complex(realPart, imgPart);
    }

    // Método principal para la ejecución
    public static void main(String[] args) {
        Complex c1 = new Complex(3, 4);
        Complex c2 = new Complex(1, 2);

        // Operaciones
        Complex sum = c1.addition(c2);
        Complex diff = c1.subtraction(c2);
        Complex prod = c1.multiplication(c2);
        Complex quot = c1.division(c2);

        // Imprimir resultados
        System.out.println("Suma: " + sum);
        System.out.println("Resta: " + diff);
        System.out.println("Multiplicación: " + prod);
        System.out.println("División: " + quot);

        // Otras operaciones
        System.out.println("Conjugado de c1: " + c1.conjugate());
        System.out.println("Módulo de c1: " + c1.module());
        System.out.println("Fase de c1: " + c1.phase());
        System.out.println("c1 elevado al cuadrado: " + c1.power(2));
        System.out.println("Raíz cuadrada de c1: " + c1.squareRoot());
        System.out.println("Logaritmo de c1: " + c1.logarithm());

        // Método toComplex
        Complex c3 = Complex.toComplex("3 + 4i");
        System.out.println("Número complejo de cadena: " + c3);
    }
}

