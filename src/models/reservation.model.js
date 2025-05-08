const mongoose = require("mongoose"); // Importamos mongoose para crear el esquema y modelo




/**
 * Esquema de Reserva para MongoDB
 * 
 * Define la estructura de datos para almacenar las reservas de libros en la base de datos.
 * Una reserva establece una relación entre un usuario, un libro y un período de tiempo.
*/
const ReservationSchema = new mongoose.Schema(
    {
    // Usuario que realiza la reserva (relación con el modelo User)
    usuario: {
        type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para referencia
        ref: "User", // Referencia al modelo User
        required: true // Campo obligatorio
    },

    // Libro que se está reservando (relación con el modelo Book)
    libro: {
        type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para referencia
        ref: "Book", // Referencia al modelo Book
        required: true // Campo obligatorio
    },

    // Fecha en que se realizó la reserva
    fechaReserva: {
        type: Date, // Tipo fecha
        default: Date.now // Por defecto la fecha actual
    },

    // Fecha límite para devolver el libro
    fechaEntrega: {
        type: Date, // Tipo fecha
        required: true // Campo obligatorio
    }
    },
    {
        // Configuración adicional del esquema
        timestamps: true // Añade automáticamente campos createdAt y updatedAt
    }
);



/**
 * Modelo de Reserva para MongoDB
 * 
 * Permite realizar operaciones CRUD sobre la colección 'Reservation' en MongoDB.
 * 
 * @example
 * // Crear una nueva reserva
 * const nuevaReserva = new ReservationModel({
 *   usuario: "60d5ec9af682fbd12a0f968a", // ID del usuario
 *   libro: "60d5ecb2f682fbd12a0f968c",   // ID del libro
 *   fechaEntrega: new Date("2023-12-31") // Fecha límite de entrega
 * });
 * await nuevaReserva.save();
 * 
 * @example
 * // Buscar reservas de un usuario específico con populate
 * const reservas = await ReservationModel.find({ usuario: userId })
 *   .populate('libro')
 *   .populate('usuario');
*/
const ReservationModel = mongoose.model("Reservation", ReservationSchema);




// Exportamos el modelo para usarlo en otras partes de la aplicación
module.exports = ReservationModel;