const ReservationModel = require("../models/reservation.model"); // Importamos el modelo de reserva




/**
 * Función para listar todas las reservas de un libro específico
 * 
 * Esta acción busca todas las reservas asociadas a un libro determinado
 * e incluye información básica sobre los usuarios que hicieron las reservas.
 * 
 * @param {string} bookId - ID del libro para buscar sus reservas
 * @returns {Promise<Array>} - Promesa que resuelve con la lista de reservas
 * 
 * @example
 * // Obtener todas las reservas de un libro específico
 * const reservas = await listReservationsByBookAction("60d5ecb2f682fbd12a0f968c");
 * console.log(reservas); // Lista de reservas con datos básicos de usuarios
*/
async function listReservationsByBookAction(bookId) {
    return ReservationModel
    .find({ libro: bookId }) // Filtramos por el ID del libro
    .populate("usuario", "nombre correo"); // Incluimos datos básicos del usuario (nombre y correo)
}




module.exports = listReservationsByBookAction; // Exportamos la función para usarla en otros archivos