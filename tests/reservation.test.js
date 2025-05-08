/**
 * Tests unitarios para las acciones de reservas
 * 
 * Este archivo prueba las principales acciones CRUD para la entidad Reserva,
 * verificando la integración entre usuarios, libros y reservas.
*/


// Importamos dependencias necesarias
const mongoose = require("mongoose"); // Librería ODM para MongoDB
const connectDB = require("../src/database"); // Función de conexión a BD

// Importamos los modelos necesarios para la prueba
const ReservationModel = require("../src/models/reservation.model"); // Modelo de reserva
const UserModel = require("../src/models/user.model"); // Modelo de usuario
const BookModel = require("../src/models/book.model"); // Modelo de libro

// Importamos las acciones a probar
const createReservationAction = require("../src/actions/create.reservation.action");
const listReservationsByBookAction = require("../src/actions/list.reservations.byBook.action");
const listReservationsByUserAction = require("../src/actions/list.reservations.byUser.action");




/**
 * Antes de todas las pruebas, conectamos a la base de datos
*/
beforeAll(async () => {
  await connectDB(); // Establecemos conexión a MongoDB
});


/**
 * Después de todas las pruebas, limpiamos la base de datos y cerramos conexión
*/
afterAll(async () => {
  // Limpiamos todas las colecciones usadas en las pruebas
  await ReservationModel.deleteMany({}); // Eliminamos reservas
  await UserModel.deleteMany({});        // Eliminamos usuarios
  await BookModel.deleteMany({});        // Eliminamos libros
  await mongoose.connection.close();     // Cerramos la conexión
});


/**
 * Suite de pruebas para las acciones de Reserva
*/
describe("Acciones de Reservation", () => {
  // Variables para almacenar entidades entre pruebas
  let user, book, reservation;

  /**
   * Prueba de creación de reserva (incluye preparación de datos)
   */
  it("createReservationAction debe crear usuario, libro y reserva", async () => {
    // Creamos un usuario de prueba directamente con el modelo
    user = await UserModel.create({ 
      nombre: "U", 
      correo: "u@u.com", 
      contraseña: "pass" 
    });
    
    // Creamos un libro de prueba directamente con el modelo
    book = await BookModel.create({ 
      titulo: "B", 
      autor: "A" 
    });
    
    // Creamos una reserva usando la acción (a probar)
    reservation = await createReservationAction({
      usuario: user._id,
      libro: book._id,
      fechaEntrega: new Date(Date.now() + 86400000) // 1 día en el futuro
    });
    
    // Verificamos que la reserva se crea correctamente
    expect(reservation).toHaveProperty("_id");
    // Verificamos que el usuario asociado sea correcto
    expect(reservation.usuario.toString()).toBe(user._id.toString());
  });

  /**
   * Prueba de listado de reservas por libro
   */
  it("listReservationsByBookAction debe listar reservas por libro", async () => {
    // Obtenemos la lista de reservas para el libro creado
    const list = await listReservationsByBookAction(book._id);
    
    // Verificamos que la reserva esté asociada al libro correcto
    expect(list[0].libro.toString()).toBe(book._id.toString());
    // Verificamos que los datos del usuario se hayan populado
    expect(list[0].usuario.nombre).toBe("U");
  });

  /**
   * Prueba de listado de reservas por usuario
   */
  it("listReservationsByUserAction debe listar reservas por usuario", async () => {
    // Obtenemos la lista de reservas para el usuario creado
    const list = await listReservationsByUserAction(user._id);
    
    // Verificamos que no se incluyan datos completos del usuario (solo se populan libros)
    expect(list[0].usuario.toString()).toBeUndefined(); // solo trae libro
    // Verificamos que los datos del libro se hayan populado
    expect(list[0].libro.titulo).toBe("B");
  });
});