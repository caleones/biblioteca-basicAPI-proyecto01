const BookModel = require("../models/book.model"); // Importamos el modelo de libro




/**
 * Función para actualizar datos de un libro existente
 * 
 * Esta acción busca un libro por su ID y actualiza los campos
 * proporcionados, devolviendo el documento actualizado.
 * 
 * @param {string} id - ID del libro a actualizar
 * @param {Object} data - Datos a actualizar (pueden ser uno o varios campos)
 * @param {string} [data.titulo] - Nuevo título (opcional)
 * @param {string} [data.autor] - Nuevo autor (opcional)
 * @param {string} [data.genero] - Nuevo género (opcional)
 * @param {string} [data.editorial] - Nueva editorial (opcional)
 * @param {Date} [data.fechaPublicacion] - Nueva fecha de publicación (opcional)
 * @param {Boolean} [data.disponibilidad] - Nuevo estado de disponibilidad (opcional)
 * 
 * @returns {Promise<Object>} - Promesa que resuelve con el libro actualizado
 * @throws {Error} - Si el ID no existe o hay problemas con la actualización
 * 
 * @example
 * // Actualizar el género y disponibilidad de un libro
 * const libroActualizado = await updateBookAction("60f7a9b9e8b42c001f3a9a1b", { 
 *   genero: "Ciencia Ficción",
 *   disponibilidad: false 
 * });
*/
async function updateBookAction(id, data) {
    // Usamos findByIdAndUpdate para buscar y actualizar en una sola operación
    return BookModel.findByIdAndUpdate(
    id, // ID del libro a actualizar
    { $set: data }, // Operador $set de MongoDB para actualizar solo los campos proporcionados
    { new: true } // Opción para devolver el documento actualizado en lugar del original
    );
}




module.exports = updateBookAction; // Exportamos la función para usarla en otros archivos