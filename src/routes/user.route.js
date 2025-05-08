const { Router } = require("express"); // Importamos Router de express para crear rutas

/**
 * Importamos todos los controladores necesarios para las operaciones CRUD desde user.controller.js.
 * CREATE: createUser.
 * READ: loginUser.
 * UPDATE: updateUser.
 * DELETE: deleteUser.
*/
const {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
} = require("../controllers/user.controller");

const verifyToken = require("../middlewares/auth.middleware"); // Importamos el middleware de autenticación que verifica tokens JWT para proteger rutas privadas


/**
 * Router para gestionar las rutas relacionadas con usuarios
 * 
 * Este router define los endpoints relacionados con la gestión de usuarios,
 * cada uno asociado a su controlador correspondiente.
 * 
 * Rutas implementadas:
 * - POST /users: Crear un nuevo usuario (acceso público)
*/
const userRoutes = Router();




/**
 * Ruta para crear un nuevo usuario
 * 
 * Endpoint: POST /users
 * Acceso: Público (no requiere autenticación)
 * 
 * Cuerpo de la petición (JSON):
 * {
 *   "nombre": "Nombre del usuario",
 *   "correo": "email@ejemplo.com",
 *   "contraseña": "contraseña123",
 *   "permisos": ["lector"] (opcional)
 * }
 * 
 * @see createUser en ../controllers/user.controller.js para más detalles sobre la respuesta
*/
userRoutes.post("/users", createUser);



/**
 * Ruta para autenticación de usuarios
 * 
 * Endpoint: POST /login
 * Acceso: Público (no requiere autenticación previa)
 * 
 * Cuerpo de la petición (JSON):
 * {
 *   "correo": "email@ejemplo.com",
 *   "contraseña": "contraseña123"
 * }
 * 
 * Respuesta exitosa (200 OK):
 * {
 *   "message": "Login exitoso",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * @see loginUser en ../controllers/user.controller.js para más detalles
*/
userRoutes.post("/login", loginUser);



/**
 * Ruta para actualizar datos de un usuario existente
 * 
 * Endpoint: PUT /users/:id
 * Acceso: Protegido (requiere autenticación)
 * 
 * Parámetros URL:
 * - id: Identificador único del usuario a actualizar
 * 
 * Cuerpo de la petición (JSON):
 * {
 *   "nombre": "Nuevo nombre", (opcional)
 *   "correo": "nuevo@email.com", (opcional)
 *   "permisos": ["nuevo_permiso"], (opcional)
 *   "habilitado": true/false (opcional)
 * }
 * 
 * Autorización:
 * - Un usuario puede actualizar sus propios datos
 * - Un usuario con permiso "modificar_usuario" puede actualizar cualquier usuario
 * 
 * @see updateUser en ../controllers/user.controller.js para más detalles
 */
userRoutes.put("/users/:id", verifyToken, updateUser);



/**
 * Ruta para deshabilitar (eliminar lógicamente) un usuario
 * 
 * Endpoint: DELETE /users/:id
 * Acceso: Protegido (requiere autenticación)
 * 
 * Parámetros URL:
 * - id: Identificador único del usuario a deshabilitar
 * 
 * No requiere cuerpo en la petición
 * 
 * Autorización:
 * - Un usuario puede deshabilitar su propia cuenta
 * - Un usuario con permiso "inhabilitar_usuario" puede deshabilitar cualquier cuenta
 * 
 * Respuesta exitosa (200 OK):
 * {
 *   "message": "Usuario deshabilitado"
 * }
 * 
 * @see deleteUser en ../controllers/user.controller.js para más detalles
*/
userRoutes.delete("/users/:id", verifyToken, deleteUser);




// Exportamos las rutas para usarlas en la configuración principal de Express
module.exports = userRoutes;