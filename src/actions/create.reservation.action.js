const ReservationModel = require("../models/reservation.model"); // Importamos el modelo de reserva
const BookModel = require("../models/book.model"); // Importamos el modelo de libro




/**
 * Función para crear una nueva reserva de libro
 * 
 * Esta acción crea una nueva reserva asociando un usuario con un libro
 * y establece las fechas de reserva y entrega. También verifica la 
 * disponibilidad del libro antes de crear la reserva.
 * 
 * @param {Object} data - Datos de la reserva
 * @param {string} data.usuario - ID del usuario que realiza la reserva
 * @param {string} data.libro - ID del libro que se está reservando
 * @param {Date} [data.fechaReserva=Date.now()] - Fecha de inicio de la reserva (opcional)
 * @param {Date} data.fechaEntrega - Fecha límite para devolver el libro
 * 
 * @returns {Promise<Object>} - Promesa que resuelve con la reserva creada
 * @throws {Error} - "Libro no disponible" si el libro ya está reservado o prestado
 * 
 * @example
 * // Crear una nueva reserva
 * const reserva = await createReservationAction({
 *   usuario: "60d5ec9af682fbd12a0f968a",
 *   libro: "60d5ecb2f682fbd12a0f968c",
 *   fechaEntrega: new Date("2023-12-31")
 * });
*/
async function createReservationAction({ usuario, libro, fechaReserva, fechaEntrega }) {
    // Verificar que el libro esté disponible
    const book = await BookModel.findById(libro);
    if (!book || !book.disponibilidad) {
    throw new Error("Libro no disponible");
    }

    // Crear la reserva con los datos proporcionados
        const reservation = new ReservationModel({ 
        usuario, 
        libro, 
        fechaReserva, 
        fechaEntrega 
    });

    // Actualizar el estado del libro a no disponible
    await BookModel.findByIdAndUpdate(libro, { disponibilidad: false });

    // Guardar y devolver la reserva
    return reservation.save();
}




module.exports = createReservationAction; // Exportamos la función para usarla en otros archivos