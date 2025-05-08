/**
 * Tests unitarios para las acciones de libros
 * 
 * Este archivo prueba las principales acciones CRUD para la entidad Libro,
 * verificando que funcionen correctamente contra una base de datos real.
*/


// Importamos dependencias necesarias
const mongoose = require("mongoose"); // Librería ODM para MongoDB
const connectDB = require("../src/database"); // Función de conexión a BD
const BookModel = require("../src/models/book.model"); // Modelo de libro

// Importamos las acciones a probar
const createBookAction = require("../src/actions/create.book.action"); // Creación
const readBookAction = require("../src/actions/read.book.action");     // Lectura individual
const listBooksAction = require("../src/actions/list.books.action");   // Listado con filtros
const updateBookAction = require("../src/actions/update.book.action"); // Actualización
const deleteBookAction = require("../src/actions/delete.book.action"); // Eliminación lógica




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
  await BookModel.deleteMany({}); // Eliminamos todos los libros creados en pruebas
  await mongoose.connection.close(); // Cerramos la conexión a MongoDB
});


/**
 * Suite de pruebas para las acciones CRUD de libros
*/
describe("Acciones de Book", () => {
  let book; // Variable para almacenar el libro creado entre pruebas

  /**
   * Prueba de creación de libro
   */
  it("createBookAction debe crear un libro", async () => {
    // Creamos un libro de prueba
    book = await createBookAction({
      titulo: "Test Book",
      autor: "Autor X",
      genero: "Ficción"
    });
    // Verificamos que se haya creado con ID
    expect(book).toHaveProperty("_id");
    // Verificamos que el título sea correcto
    expect(book.titulo).toBe("Test Book");
  });

  /**
   * Prueba de búsqueda de libro por ID
   */
  it("readBookAction debe recuperar el libro por ID", async () => {
    // Buscamos el libro creado por su ID
    const found = await readBookAction(book._id);
    // Verificamos que sea el mismo libro comparando IDs
    expect(found._id.toString()).toBe(book._id.toString());
  });

  /**
   * Prueba de listado de libros con filtros
   */
  it("listBooksAction debe listar libros filtrados", async () => {
    // Buscamos libros con el género "Ficción"
    const list = await listBooksAction({ genero: "Ficción" });
    // Verificamos que devuelva un array
    expect(Array.isArray(list)).toBe(true);
    // Verificamos que el filtro se aplique correctamente
    expect(list[0].genero).toBe("Ficción");
  });

  /**
   * Prueba de actualización de libro
   */
  it("updateBookAction debe actualizar disponibilidad", async () => {
    // Actualizamos el libro para marcarlo como no disponible
    const updated = await updateBookAction(book._id, { disponibilidad: false });
    // Verificamos que el campo se haya actualizado correctamente
    expect(updated.disponibilidad).toBe(false);
  });

  /**
   * Prueba de eliminación lógica de libro
   */
  it("deleteBookAction debe soft-delete el libro", async () => {
    // Eliminamos lógicamente el libro (marcándolo como deshabilitado)
    const deleted = await deleteBookAction(book._id);
    // Verificamos que el libro esté marcado como deshabilitado
    expect(deleted.habilitado).toBe(false);
  });
});