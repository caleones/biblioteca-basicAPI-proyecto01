const mongoose = require("mongoose"); // Importamos mongoose para crear el esquema y modelo




/**
 * Esquema de Libro para MongoDB
 * 
 * Define la estructura de datos para almacenar libros en la base de datos.
 * Incluye información bibliográfica básica y estado de disponibilidad.
*/
const BookSchema = new mongoose.Schema(
  {
    // Información básica del libro
    titulo: { 
      type: String, 
      required: true // Campo obligatorio
    },
    autor: { 
      type: String, 
      required: true // Campo obligatorio
    },
    genero: { 
      type: String // Campo opcional
    },
    editorial: { 
      type: String // Campo opcional
    },
    fechaPublicacion: { 
      type: Date // Campo opcional, formato fecha
    },
    
    // Estados del libro
    disponibilidad: { 
      type: Boolean, 
      default: true // Por defecto está disponible para préstamo
    },
    habilitado: { 
      type: Boolean, 
      default: true // Para implementar borrado lógico (soft delete)
    },
  },
  {
    timestamps: true, // Añade automáticamente campos createdAt y updatedAt
  }
);



/**
 * Modelo de Libro para operaciones en MongoDB
 * 
 * Permite realizar operaciones CRUD sobre la colección 'Book'.
 * 
 * @example
 * // Buscar libros por género
 * const librosFantasia = await BookModel.find({ genero: "Fantasía", habilitado: true });
 * 
 * @example
 * // Crear un nuevo libro
 * const nuevoLibro = new BookModel({
 *   titulo: "Don Quijote de la Mancha",
 *   autor: "Miguel de Cervantes",
 *   genero: "Novela",
 *   editorial: "Francisco de Robles",
 *   fechaPublicacion: new Date("1605-01-01")
 * });
 * await nuevoLibro.save();
*/
const BookModel = mongoose.model("Book", BookSchema);




// Exportamos el modelo para usarlo en otras partes de la aplicación
module.exports = BookModel;