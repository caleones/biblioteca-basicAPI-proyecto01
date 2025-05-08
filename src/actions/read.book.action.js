const BookModel = require("../models/book.model"); // Importamos el modelo de libro




/**
 * Función para buscar un libro por su ID
 * 
 * Esta acción busca un libro específico en la base de datos usando su ID
 * y verifica que esté habilitado (no eliminado lógicamente).
 * 
 * @param {string} id - ID del libro a buscar
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del libro
 * @throws {Error} - "Libro no encontrado" si el ID no existe o el libro está deshabilitado
 * 
 * @example
 * try {
 *   const libro = await readBookAction("60f7a9b9e8b42c001f3a9a1b");
 *   console.log(libro.titulo); // Muestra el título del libro encontrado
 * } catch (error) {
 *   console.error(error.message); // Maneja el error si el libro no existe
 * }
*/
async function readBookAction(id) {
    // Buscamos el libro por ID y que esté habilitado
    const book = await BookModel.findOne({ _id: id, habilitado: true });

    // Si no encontramos el libro, lanzamos un error
    if (!book) throw new Error("Libro no encontrado");

    // Devolvemos el libro encontrado
    return book;
}




module.exports = readBookAction; // Exportamos la función para usarla en otros archivos