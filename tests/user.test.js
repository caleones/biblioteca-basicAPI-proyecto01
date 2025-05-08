/**
 * Tests unitarios para las acciones de usuarios
 * 
 * Este archivo prueba las principales acciones CRUD para la entidad Usuario,
 * verificando que funcionen correctamente contra una base de datos real.
*/


// Importamos dependencias necesarias
const mongoose = require("mongoose"); // Librería ODM para MongoDB
const connectDB = require("../src/database"); // Función de conexión a BD
const UserModel = require("../src/models/user.model"); // Modelo de usuario

// Importamos las acciones a probar
const createUserAction = require("../src/actions/create.user.action"); // Acción de creación
const readUserAction = require("../src/actions/read.user.action"); // Acción de autenticación
const updateUserAction = require("../src/actions/update.user.action"); // Acción de actualización
const deleteUserAction = require("../src/actions/delete.user.action"); // Acción de eliminación




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
  await UserModel.deleteMany({}); // Eliminamos todos los usuarios creados en pruebas
  await mongoose.connection.close(); // Cerramos la conexión a MongoDB
});


/**
 * Suite de pruebas para las acciones CRUD de usuarios
*/
describe("Acciones de User", () => {
  let createdUser; // Variable para almacenar el usuario creado entre pruebas

  /**
   * Prueba de creación de usuario
   */
  it("createUserAction debe crear un usuario", async () => {
    // Creamos un usuario de prueba
    createdUser = await createUserAction({
      nombre: "Tester",
      correo: "tester@example.com",
      contraseña: "secret123",
    });
    // Verificamos que se haya creado correctamente con un ID
    expect(createdUser).toHaveProperty("_id");
    // Verificamos que el correo se haya guardado correctamente
    expect(createdUser.correo).toBe("tester@example.com");
  });

  /**
   * Prueba de autenticación de usuario
   */
  it("readUserAction debe autenticar al usuario", async () => {
    // Autenticamos al usuario con credenciales
    const user = await readUserAction({
      correo: "tester@example.com",
      contraseña: "secret123",
    });
    // Verificamos que devuelva un usuario con ID
    expect(user).toHaveProperty("_id");
    // Verificamos que sea el mismo usuario por su correo
    expect(user.correo).toBe("tester@example.com");
  });

  /**
   * Prueba de actualización de usuario
   */
  it("updateUserAction debe actualizar el nombre", async () => {
    // Actualizamos el nombre del usuario creado
    const updated = await updateUserAction(createdUser._id, { nombre: "Updated" });
    // Verificamos que el nombre se haya actualizado
    expect(updated.nombre).toBe("Updated");
  });

  /**
   * Prueba de eliminación lógica (deshabilitación) de usuario
   */
  it("deleteUserAction debe deshabilitar al usuario", async () => {
    // Deshabilitamos al usuario creado
    const deleted = await deleteUserAction(createdUser._id);
    // Verificamos que el campo habilitado sea false
    expect(deleted.habilitado).toBe(false);
  });
});