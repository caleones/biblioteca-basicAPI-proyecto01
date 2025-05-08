const BookModel = require("../models/book.model"); // Importamos el modelo de libro




/**
 * Función para "eliminar" un libro mediante borrado lógico
 * 
 * Esta acción no elimina físicamente el libro de la base de datos,
 * sino que lo marca como deshabilitado (habilitado = false).
 * Esto permite mantener el historial y referencias, evitando problemas
 * de integridad en la base de datos.
 * 
 * @param {string} id - ID del libro a deshabilitar
 * @returns {Promise<Object>} - Promesa que resuelve con el libro deshabilitado
 * @throws {Error} - Si el ID no existe o hay problemas con la operación
 * 
 * @example
 * // Deshabilitar un libro
 * const libroDeshabilitado = await deleteBookAction("60f7a9b9e8b42c001f3a9a1b");
*/
async function deleteBookAction(id) {
    // Usamos findByIdAndUpdate para buscar y actualizar en una sola operación
    return BookModel.findByIdAndUpdate(
    id, // ID del libro a "eliminar"
    { $set: { habilitado: false } }, // Marcamos como deshabilitado (borrado lógico)
    { new: true } // Devolvemos el documento actualizado
    );
}




module.exports = deleteBookAction; // Exportamos la función para usarla en otros archivos