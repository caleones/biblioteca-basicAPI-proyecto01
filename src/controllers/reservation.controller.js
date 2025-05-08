const createReservationAction = require("../actions/create.reservation.action"); // Importamos la acción de crear reservas
const listReservationsByUserAction = require("../actions/list.reservations.byUser.action"); // Importamos la acción de listar reservas por usuario
const listReservationsByBookAction = require("../actions/list.reservations.byBook.action"); // Importamos la acción de listar reservas por libro




/**
 * Controlador para crear una nueva reserva de libro
 * 
 * Este controlador recibe los datos de la reserva desde la solicitud HTTP,
 * extrae el ID del usuario desde el token JWT (añadido por el middleware de autenticación)
 * y pasa toda la información a la acción correspondiente.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.user - Datos del usuario autenticado (añadido por el middleware de auth)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.body - Datos de la reserva
 * @param {string} req.body.libro - ID del libro a reservar
 * @param {Date} [req.body.fechaReserva] - Fecha de inicio (opcional)
 * @param {Date} req.body.fechaEntrega - Fecha límite de devolución
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Respuesta exitosa (201 Created):
 * // {
 * //   "message": "Reserva creada",
 * //   "reservation": { ... datos de la reserva creada ... }
 * // }
 * 
 * @example
 * // Respuesta de error (400 Bad Request):
 * // {
 * //   "message": "Libro no disponible" u otro mensaje de error
 * // }
*/
async function createReservation(req, res) {
    try {
    // Preparamos los datos para la acción, tomando el ID del usuario del token
    const data = {
        usuario: req.user.id, // ID del usuario autenticado
        libro: req.body.libro, // ID del libro a reservar
        fechaReserva: req.body.fechaReserva, // Fecha de inicio (opcional)
        fechaEntrega: req.body.fechaEntrega // Fecha límite de devolución
    };

    // Llamamos a la acción para crear la reserva
    const reservation = await createReservationAction(data);

    // Devolvemos código 201 (Created) y los datos de la reserva
    res.status(201).json({ message: "Reserva creada", reservation });
    } catch (err) {
        // Si hay error (ej: libro no disponible), devolvemos código 400
        res.status(400).json({ message: err.message });
    }
}



/**
 * Controlador para obtener todas las reservas de un libro específico
 * 
 * Este controlador recibe el ID del libro como parámetro en la URL,
 * consulta el historial de reservas mediante la acción correspondiente
 * y devuelve la lista de reservas con información de los usuarios.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del libro a consultar
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Respuesta exitosa (200 OK):
 * // {
 * //   "message": "Historial de reservas del libro",
 * //   "reservations": [ ... lista de reservas con datos de usuarios ... ]
 * // }
*/
async function getReservationsByBook(req, res) {
    try {
        // Obtenemos el ID del libro desde los parámetros de la URL
        const bookId = req.params.id;
        
        // Llamamos a la acción para obtener las reservas del libro
        const reservations = await listReservationsByBookAction(bookId);
        
        // Devolvemos la lista de reservas
        res.json({ message: "Historial de reservas del libro", reservations });
    } catch (err) {
        // Si hay error, devolvemos código 400 y el mensaje
        res.status(400).json({ message: err.message });
    }
}


  
/**
 * Controlador para obtener todas las reservas de un usuario específico
 * 
 * Este controlador recibe el ID del usuario como parámetro en la URL,
 * consulta el historial de reservas mediante la acción correspondiente
 * y devuelve la lista de reservas con información de los libros.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del usuario a consultar
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Respuesta exitosa (200 OK):
 * // {
 * //   "message": "Historial de reservas del usuario",
 * //   "reservations": [ ... lista de reservas con datos de libros ... ]
 * // }
 */
async function getReservationsByUser(req, res) {
    try {
        // Obtenemos el ID del usuario desde los parámetros de la URL
        const userId = req.params.id;
        
        // Llamamos a la acción para obtener las reservas del usuario
        const reservations = await listReservationsByUserAction(userId);
        
        // Devolvemos la lista de reservas
        res.json({ message: "Historial de reservas del usuario", reservations });
    } catch (err) {
        // Si hay error, devolvemos código 400 y el mensaje
        res.status(400).json({ message: err.message });
    }
}




module.exports = {
    createReservation,
    getReservationsByBook,
    getReservationsByUser
};