const createBookAction = require("../actions/create.book.action"); // Importamos la acción para crear libros
const readBookAction = require("../actions/read.book.action"); // Importamos la acción para buscar libros
const updateBookAction = require("../actions/update.book.action"); // Importamos la acción para actualizar libros
const deleteBookAction = require("../actions/delete.book.action"); // Importamos la acción para eliminar libros

const listBooksAction = require("../actions/list.books.action"); // Importamos la acción para listar libros




/**
 * Controlador para crear un nuevo libro
 * 
 * Este controlador recibe los datos del libro desde la solicitud HTTP,
 * los pasa a la acción correspondiente y maneja la respuesta o los errores.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.body - Datos del libro a crear
 * @param {string} req.body.titulo - Título del libro
 * @param {string} req.body.autor - Autor del libro
 * @param {string} [req.body.genero] - Género literario (opcional)
 * @param {string} [req.body.editorial] - Editorial (opcional)
 * @param {Date} [req.body.fechaPublicacion] - Fecha de publicación (opcional)
 * 
 * @returns {Promise<void>} 
 * 
 * @example
 * // Respuesta exitosa (201 Created):
 * // {
 * //   "message": "Libro creado",
 * //   "book": { ... datos del libro creado ... }
 * // }
*/
async function createBook(req, res) {
    try {
        // Llamamos a la acción que contiene la lógica de negocio
        const book = await createBookAction(req.body);
        
        // Devolvemos código 201 (Created) y los datos del libro
        res.status(201).json({ message: "Libro creado", book });
    } catch (err) {
        // Si hay error, devolvemos código 400 (Bad Request) y el mensaje
        res.status(400).json({ message: err.message });
    }
}



/**
 * Controlador para obtener un libro por su ID
 * 
 * Este controlador recibe el ID del libro como parámetro en la URL,
 * busca el libro mediante la acción correspondiente y devuelve los datos
 * o un error si no se encuentra.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del libro a buscar
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Respuesta exitosa (200 OK):
 * // {
 * //   "message": "Libro encontrado",
 * //   "book": { ... datos del libro ... }
 * // }
 * 
 * @example
 * // Respuesta de error (404 Not Found):
 * // {
 * //   "message": "Libro no encontrado"
 * // }
*/
async function getBookById(req, res) {
    try {
    // Extraemos el ID del libro de los parámetros de la URL
    const bookId = req.params.id;

    // Llamamos a la acción para buscar el libro por ID
    const book = await readBookAction(bookId);

    // Si se encuentra, devolvemos el libro con código 200 (OK)
    res.json({ message: "Libro encontrado", book });
    } catch (err) {
    // Si no se encuentra, devolvemos código 404 (Not Found)
    res.status(404).json({ message: err.message });
    }
}



/**
 * Controlador para actualizar datos de un libro existente
 * 
 * Este controlador recibe el ID del libro como parámetro en la URL y
 * los datos a actualizar en el cuerpo de la solicitud, luego pasa esta
 * información a la acción correspondiente y devuelve el libro actualizado.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del libro a actualizar
 * @param {Object} req.body - Datos a actualizar (uno o varios campos)
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Respuesta exitosa (200 OK):
 * // {
 * //   "message": "Libro actualizado",
 * //   "book": { ... datos actualizados del libro ... }
 * // }
*/
async function updateBook(req, res) {
    try {
        // Llamamos a la acción con el ID del libro y los datos a actualizar
        const book = await updateBookAction(req.params.id, req.body);
        
        // Devolvemos el libro actualizado con mensaje descriptivo
        res.json({ message: "Libro actualizado", book });
    } catch (err) {
        // Si hay error, devolvemos código 400 (Bad Request) y el mensaje
        res.status(400).json({ message: err.message });
    }
}



/**
 * Controlador para deshabilitar (eliminar lógicamente) un libro
 * 
 * Este controlador recibe el ID del libro como parámetro en la URL,
 * llama a la acción correspondiente para marcarlo como deshabilitado
 * y devuelve una confirmación de la operación.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del libro a deshabilitar
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Respuesta exitosa (200 OK):
 * // {
 * //   "message": "Libro deshabilitado"
 * // }
*/
async function deleteBook(req, res) {
    try {
    // Llamamos a la acción para deshabilitar el libro
    await deleteBookAction(req.params.id);

    // Devolvemos mensaje de confirmación sin incluir los datos del libro
    res.json({ message: "Libro deshabilitado" });
    } catch (err) {
    // Si hay error, devolvemos código 400 (Bad Request) y el mensaje
    res.status(400).json({ message: err.message });
    }
}



/**
 * Controlador para obtener un listado filtrado de libros
 * 
 * Este controlador recibe parámetros de consulta (query) en la URL,
 * los pasa como filtros a la acción correspondiente y devuelve la lista resultante.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.query - Parámetros de consulta en la URL
 * @param {string} [req.query.titulo] - Filtrar por título (parcial)
 * @param {string} [req.query.autor] - Filtrar por autor
 * @param {string} [req.query.genero] - Filtrar por género
 * @param {string} [req.query.editorial] - Filtrar por editorial
 * @param {string} [req.query.disponibilidad] - Filtrar por disponibilidad ("true"/"false")
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // URL de ejemplo: /books?autor=Cervantes&disponibilidad=true
 * 
 * // Respuesta exitosa (200 OK):
 * // {
 * //   "message": "Listado de libros",
 * //   "books": [ ... lista de libros que cumplen los filtros ... ]
 * // }
*/
async function listBooks(req, res) {
    try {
        // Pasamos directamente los parámetros de consulta como filtros
        const books = await listBooksAction(req.query);
        
        // Devolvemos la lista de libros con un mensaje descriptivo
        res.json({ message: "Listado de libros", books });
    } catch (err) {
        // Si hay error, devolvemos código 400 y el mensaje
        res.status(400).json({ message: err.message });
    }
}




// Exportamos los controladores disponibles en este archivo
module.exports = {
    createBook,
    getBookById,
    updateBook,
    deleteBook,
    listBooks,
};