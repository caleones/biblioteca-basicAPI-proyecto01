const ReservationModel = require("../models/reservation.model"); // Importamos el modelo de reserva




/**
 * Función para listar todas las reservas de un usuario específico
 * 
 * Esta acción busca todas las reservas asociadas a un usuario determinado
 * e incluye información básica sobre los libros que ha reservado.
 * 
 * @param {string} userId - ID del usuario para buscar sus reservas
 * @returns {Promise<Array>} - Promesa que resuelve con la lista de reservas
 * 
 * @example
 * // Obtener todas las reservas de un usuario específico
 * const reservas = await listReservationsByUserAction("60d5ec9af682fbd12a0f968a");
 * console.log(reservas); // Lista de reservas con datos básicos de libros
*/
async function listReservationsByUserAction(userId) {
    return ReservationModel
    .find({ usuario: userId }) // Filtramos por el ID del usuario
    .populate("libro", "titulo autor"); // Incluimos datos básicos del libro (título y autor)
}




module.exports = listReservationsByUserAction; // Exportamos la función para usarla en otros archivos