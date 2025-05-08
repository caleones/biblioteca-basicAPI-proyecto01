const BookModel = require("../models/book.model"); // Importamos el modelo de libro




/**
 * Función para listar libros con filtros opcionales
 * 
 * Esta acción obtiene una lista de libros aplicando los filtros
 * proporcionados. Siempre excluye libros deshabilitados (borrado lógico).
 * 
 * @param {Object} filters - Filtros a aplicar en la búsqueda
 * @param {string} [filters.genero] - Filtrar por género literario
 * @param {string} [filters.editorial] - Filtrar por editorial
 * @param {string} [filters.autor] - Filtrar por autor
 * @param {string} [filters.titulo] - Filtrar por título (búsqueda parcial, no sensible a mayúsculas)
 * @param {string} [filters.fechaPublicacion] - Filtrar por fecha de publicación exacta
 * @param {string} [filters.disponibilidad] - Filtrar por disponibilidad ("true" o "false")
 * 
 * @returns {Promise<Array>} - Promesa que resuelve con la lista de libros encontrados
 * 
 * @example
 * // Listar todos los libros disponibles de cierto autor
 * const libros = await listBooksAction({ autor: "Gabriel García Márquez", disponibilidad: "true" });
 * 
 * @example
 * // Buscar libros cuyo título contenga una palabra
 * const libros = await listBooksAction({ titulo: "Quijote" });
*/
async function listBooksAction(filters) {
    // Iniciamos con un filtro que siempre incluye solo libros habilitados
    const query = { habilitado: true };

    // Añadimos cada filtro proporcionado a la consulta
    if (filters.genero) query.genero = filters.genero;
    if (filters.editorial) query.editorial = filters.editorial;
    if (filters.autor) query.autor = filters.autor;

    // Para el título usamos una expresión regular que permite búsqueda parcial
    // La opción "i" hace que no sea sensible a mayúsculas/minúsculas
    if (filters.titulo) query.titulo = new RegExp(filters.titulo, "i");

    if (filters.fechaPublicacion)
    query.fechaPublicacion = new Date(filters.fechaPublicacion);

    // Convertimos el string "true"/"false" a un booleano para la consulta
    if (filters.disponibilidad !== undefined)
    query.disponibilidad = filters.disponibilidad === "true";

    // Ejecutamos la consulta con todos los filtros aplicados
    return BookModel.find(query);
}




module.exports = listBooksAction; // Exportamos la función para usarla en otros archivos