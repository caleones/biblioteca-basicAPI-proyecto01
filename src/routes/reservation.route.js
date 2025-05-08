const { Router } = require("express"); // Importamos Router de Express
const verifyToken = require("../middlewares/auth.middleware"); // Middleware de autenticación

// Importamos los controladores de reservas necesarios
const {
  createReservation,
  getReservationsByBook,
  getReservationsByUser
} = require("../controllers/reservation.controller");


/**
 * Router para gestionar las rutas relacionadas con reservas de libros
 * 
 * Este router define los endpoints para crear y consultar reservas de libros,
 * aplicando la protección mediante JWT donde corresponde.
*/
const reservationRoutes = Router();




/**
 * Ruta para crear una nueva reserva de libro
 * 
 * Endpoint: POST /reservations
 * Acceso: Protegido (requiere autenticación)
 * 
 * Cuerpo de la petición (JSON):
 * {
 *   "libro": "60d5ecb2f682fbd12a0f968c", // ID del libro a reservar (obligatorio)
 *   "fechaEntrega": "2023-12-31" // Fecha límite de devolución (obligatorio)
 * }
 * 
 * Autorización: Requiere token JWT válido. El ID de usuario se obtiene del token.
 * 
 * @see createReservation en ../controllers/reservation.controller.js para más detalles
*/
reservationRoutes.post("/reservations", verifyToken, createReservation);



/**
 * Ruta para obtener historial de reservas de un libro específico
 * 
 * Endpoint: GET /books/:id/reservations
 * Acceso: Protegido (requiere autenticación)
 * 
 * Parámetros URL:
 * - id: Identificador único del libro del cual consultar las reservas
 * 
 * No requiere cuerpo en la petición
 * 
 * Autorización: Requiere token JWT válido
 * 
 * Respuesta exitosa (200 OK):
 * {
 *   "message": "Historial de reservas del libro",
 *   "reservations": [ ... lista de reservas con datos de usuarios ... ]
 * }
 * 
 * @see getReservationsByBook en ../controllers/reservation.controller.js para más detalles
*/
reservationRoutes.get(
    "/books/:id/reservations",
    verifyToken,
    getReservationsByBook
);



/**
 * Ruta para obtener historial de reservas de un usuario específico
 * 
 * Endpoint: GET /users/:id/reservations
 * Acceso: Protegido (requiere autenticación)
 * 
 * Parámetros URL:
 * - id: Identificador único del usuario del cual consultar las reservas
 * 
 * No requiere cuerpo en la petición
 * 
 * Autorización: Requiere token JWT válido
 * 
 * Respuesta exitosa (200 OK):
 * {
 *   "message": "Historial de reservas del usuario",
 *   "reservations": [ ... lista de reservas con datos de libros ... ]
 * }
 * 
 * @see getReservationsByUser en ../controllers/reservation.controller.js para más detalles
*/
reservationRoutes.get(
    "/users/:id/reservations",
    verifyToken,
    getReservationsByUser
);
 



/**
 * Exportamos el router configurado con todas las rutas de reservas
 * para integrarlo en la aplicación principal
*/
module.exports = reservationRoutes;