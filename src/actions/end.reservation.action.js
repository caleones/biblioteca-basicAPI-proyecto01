const ReservationModel = require("../models/reservation.model");
const BookModel = require("../models/book.model");




async function endReservationAction(reservationId) {
    // Buscar la reserva
    const reservation = await ReservationModel.findById(reservationId);
    if (!reservation) {
        throw new Error("Reserva no encontrada");
    }
    if (reservation.devuelto) {
        throw new Error("Reserva ya devuelta");
    }

    // Marcarla como devuelta
    reservation.devuelto = true;
    await reservation.save();

    // Volver a liberar la copia en Book
    await BookModel.findByIdAndUpdate(
        reservation.libro,
        { disponibilidad: true }
    );

    return reservation;
}




module.exports = endReservationAction;
