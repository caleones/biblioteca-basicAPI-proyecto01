const { Router } = require("express"); // Importamos Router de Express
const verifyToken = require("../middlewares/auth.middleware"); // Middleware de autenticación

// Importamos todos los controladores de libros necesarios
const {
  createBook,
  getBookById,
  listBooks,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");


/**
 * Router para gestionar las rutas relacionadas con libros
 * 
 * Este router define los endpoints para la gestión completa de libros,
 * siguiendo principios RESTful y aplicando protección mediante JWT.
*/
const bookRoutes = Router();




/**
 * Ruta para crear un nuevo libro
 * 
 * Endpoint: POST /books
 * Acceso: Protegido (requiere autenticación)
 * 
 * Cuerpo de la petición (JSON):
 * {
 *   "titulo": "Título del libro",
 *   "autor": "Nombre del autor",
 *   "genero": "Género literario", (opcional)
 *   "editorial": "Editorial", (opcional)
 *   "fechaPublicacion": "2023-04-15" (opcional, formato fecha)
 * }
 * 
 * Autorización: Requiere token JWT válido
 * 
 * @see createBook en ../controllers/book.controller.js para más detalles
*/
bookRoutes.post("/books", verifyToken, createBook);



/**
 * Ruta para listar y filtrar libros
 * 
 * Endpoint: GET /books
 * Acceso: Público (no requiere autenticación)
 * 
 * Parámetros de consulta (opcionales):
 * - titulo: Buscar por título (parcial, no sensible a mayúsculas)
 * - autor: Filtrar por autor
 * - genero: Filtrar por género literario
 * - editorial: Filtrar por editorial
 * - disponibilidad: Filtrar por disponibilidad ("true" o "false")
 * 
 * Ejemplo: GET /books?autor=Borges&genero=Ficción
 * 
 * @see listBooks en ../controllers/book.controller.js para más detalles
*/
bookRoutes.get("/books", listBooks);



/**
 * Ruta para obtener un libro específico por su ID
 * 
 * Endpoint: GET /books/:id
 * Acceso: Público (no requiere autenticación)
 * 
 * Parámetros URL:
 * - id: Identificador único del libro a consultar
 * 
 * Ejemplo: GET /books/60f7a9b9e8b42c001f3a9a1b
 * 
 * @see getBookById en ../controllers/book.controller.js para más detalles
*/
bookRoutes.get("/books/:id", getBookById);



/**
 * Ruta para actualizar un libro existente
 * 
 * Endpoint: PUT /books/:id
 * Acceso: Protegido (requiere autenticación)
 * 
 * Parámetros URL:
 * - id: Identificador único del libro a actualizar
 * 
 * Cuerpo de la petición (JSON):
 * {
 *   "titulo": "Nuevo título", (opcional)
 *   "autor": "Nuevo autor", (opcional)
 *   "genero": "Nuevo género", (opcional)
 *   "editorial": "Nueva editorial", (opcional)
 *   "fechaPublicacion": "2023-05-20", (opcional)
 *   "disponibilidad": true/false (opcional)
 * }
 * 
 * Autorización: Requiere token JWT válido
 * 
 * @see updateBook en ../controllers/book.controller.js para más detalles
*/
bookRoutes.put("/books/:id", verifyToken, updateBook);



/**
 * Ruta para deshabilitar (eliminar lógicamente) un libro
 * 
 * Endpoint: DELETE /books/:id
 * Acceso: Protegido (requiere autenticación)
 * 
 * Parámetros URL:
 * - id: Identificador único del libro a deshabilitar
 * 
 * No requiere cuerpo en la petición
 * 
 * Autorización: Requiere token JWT válido
 * 
 * Respuesta exitosa (200 OK):
 * {
 *   "message": "Libro deshabilitado"
 * }
 * 
 * @see deleteBook en ../controllers/book.controller.js para más detalles
*/
bookRoutes.delete("/books/:id", verifyToken, deleteBook);




/**
 * Exportamos el router configurado con todas las rutas de libros
 * para integrarlo en la aplicación principal
*/
module.exports = bookRoutes;