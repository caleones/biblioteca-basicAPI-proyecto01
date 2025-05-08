const BookModel = require("../models/book.model"); // Importamos el modelo de libro de la base de datos




/**
 * Función para crear un nuevo libro en la base de datos
 * 
 * Esta acción recibe los datos del libro y lo guarda en la base de datos,
 * devolviendo el documento creado con su ID generado.
 * 
 * @param {Object} data - Datos del libro a crear
 * @param {string} data.titulo - Título del libro (obligatorio)
 * @param {string} data.autor - Autor del libro (obligatorio) 
 * @param {string} [data.genero] - Género literario (opcional)
 * @param {string} [data.editorial] - Editorial (opcional)
 * @param {Date} [data.fechaPublicacion] - Fecha de publicación (opcional)
 * @param {boolean} [data.disponibilidad=true] - Estado de disponibilidad (opcional)
 * 
 * @returns {Promise<Object>} Promesa que resuelve con el libro creado
 * 
 * @example
 * // Crear un nuevo libro
 * const libro = await createBookAction({
 *   titulo: "Cien años de soledad",
 *   autor: "Gabriel García Márquez",
 *   genero: "Realismo mágico",
 *   editorial: "Sudamericana"
 * });
*/
async function createBookAction(data) {
  // Creamos una nueva instancia del modelo con los datos proporcionados
  const book = new BookModel(data);

  // Guardamos el libro en la base de datos y devolvemos el resultado
  return book.save();
}




module.exports = createBookAction; // Exportamos la función para usarla en otros archivos