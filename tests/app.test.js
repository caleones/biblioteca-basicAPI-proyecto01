/**
 * Tests de integración para la API de Biblioteca
 * 
 * Este archivo contiene pruebas para verificar que el servidor y las rutas
 * principales funcionan correctamente en un entorno controlado.
*/


// Importamos dependencias para testing
const request = require("supertest"); // Cliente HTTP para pruebas
const app = require("../src/server"); // Importamos la aplicación Express
const mongoose = require("mongoose"); // Para cerrar conexión después de tests
const connectDB = require("../src/database"); // Función de conexión a BD




/**
 * Antes de todas las pruebas, conectamos a la base de datos
 * Esta función se ejecuta una vez al inicio de las pruebas
 */
beforeAll(async () => {
  await connectDB(); // Conectamos a MongoDB (puede ser una BD de test)
});


/**
 * Después de todas las pruebas, cerramos la conexión a la BD
 * Esta función se ejecuta una vez al final de las pruebas
 */
afterAll(async () => {
  await mongoose.connection.close(); // Cerramos la conexión para evitar fugas de memoria
});


/**
 * Conjunto de pruebas para verificar la funcionalidad general de la API
 */
describe("API general", () => {
  /**
   * Prueba para verificar que la ruta principal devuelve un mensaje de estado
   */
  it("GET / → debe devolver mensaje de funcionamiento", async () => {
    // Hacemos una petición GET a la ruta raíz
    const res = await request(app).get("/");
    
    // Verificamos que el código de estado sea correcto (200 OK)
    expect(res.statusCode).toBe(200);
    
    // Verificamos que el contenido de la respuesta sea el esperado
    expect(res.body).toEqual({ message: "API Biblioteca funcionando" });
  });
});