const createUserAction = require("../actions/create.user.action"); // Importamos acción para crear usuarios
const readUserAction = require("../actions/read.user.action"); // Importamos acción para autenticar usuarios
const updateUserAction = require("../actions/update.user.action"); // Importamos acción para actualizar usuarios
const deleteUserAction = require("../actions/delete.user.action"); // Importamos acción para eliminar usuarios


const jwt = require("jsonwebtoken"); // Importamos JsonWebToken para generar tokens de sesión




/**
 * Controlador para crear un nuevo usuario
 * 
 * Este controlador recibe los datos del usuario desde la solicitud HTTP,
 * los pasa a la acción correspondiente y maneja la respuesta o los errores.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.body - Datos del usuario a crear
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.correo - Email del usuario
 * @param {string} req.body.contraseña - Contraseña (se cifrará en la acción)
 * @param {string[]} [req.body.permisos=[]] - Permisos opcionales del usuario
 * 
 * @returns {Promise<void>} 
 * 
 * @example
 * // Respuesta exitosa (201 Created):
 * // {
 * //   "message": "Usuario creado",
 * //   "user": { ... datos del usuario creado ... }
 * // }
 * 
 * @example
 * // Respuesta de error (400 Bad Request):
 * // {
 * //   "message": "El correo ya está en uso" u otro mensaje de error
 * // }
*/
async function createUser(req, res) {
  try {
    // Llamamos a la acción que contiene la lógica de negocio
    const user = await createUserAction(req.body);
    
    // Si todo va bien, devolvemos código 201 (Created) y los datos del usuario
    res.status(201).json({ message: "Usuario creado", user });
  } catch (err) {
    // Si hay error, devolvemos código 400 (Bad Request) y el mensaje de error
    res.status(400).json({ message: err.message });
  }
}



/**
 * Controlador para iniciar sesión de usuario
 * 
 * Este controlador recibe las credenciales del usuario desde la solicitud HTTP,
 * valida las credenciales mediante la acción correspondiente y, si son correctas,
 * genera un token JWT para autenticar al usuario en futuras peticiones.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.body - Credenciales del usuario
 * @param {string} req.body.correo - Correo electrónico del usuario
 * @param {string} req.body.contraseña - Contraseña en texto plano
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Respuesta exitosa (200 OK):
 * // {
 * //   "message": "Login exitoso",
 * //   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzc..."
 * // }
 * 
 * @example
 * // Respuesta de error (401 Unauthorized):
 * // {
 * //   "message": "Usuario no encontrado" o "Credenciales inválidas"
 * // }
*/
async function loginUser(req, res) {
  try {
    // Autenticamos al usuario usando la acción correspondiente
    const user = await readUserAction(req.body);
    
    // Si la autenticación es exitosa, generamos un token JWT
    const token = jwt.sign(
      { id: user._id, permisos: user.permisos }, // Payload: datos a incluir en el token
      process.env.JWT_SECRET, // Clave secreta para firmar el token
      { expiresIn: "2h" } // Configuración: token válido por 2 horas
    );
    
    // Devolvemos el token al cliente
    res.json({ message: "Login exitoso", token });
  } catch (err) {
    // Si hay error de autenticación, devolvemos código 401 (Unauthorized)
    res.status(401).json({ message: err.message });
  }
}



/**
 * Controlador para actualizar datos de un usuario existente
 * 
 * Este controlador verifica los permisos del usuario que hace la petición,
 * permitiendo que un usuario actualice sus propios datos o que un administrador
 * con el permiso adecuado actualice los datos de cualquier usuario.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.params - Parámetros de URL
 * @param {string} req.params.id - ID del usuario a actualizar
 * @param {Object} req.body - Datos a actualizar (uno o varios campos)
 * @param {Object} req.user - Datos del usuario autenticado (añadidos por el middleware de auth)
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Respuesta exitosa (200 OK):
 * // {
 * //   "message": "Usuario actualizado",
 * //   "user": { ... datos actualizados ... }
 * // }
 * 
 * @example
 * // Respuesta de error por permisos (403 Forbidden):
 * // {
 * //   "message": "No autorizado"
 * // }
*/
async function updateUser(req, res) {
  try {
    // Extraemos el ID desde los parámetros de la URL
    const { id } = req.params;
    
    // Verificamos si el usuario tiene permiso para actualizar:
    // - O es el mismo usuario (actualiza sus propios datos)
    // - O tiene el permiso específico "modificar_usuario"
    if (req.user.id !== id && !req.user.permisos.includes("modificar_usuario")) {
      return res.status(403).json({ message: "No autorizado" });
    }
    
    // Si tiene permiso, llamamos a la acción para actualizar los datos
    const user = await updateUserAction(id, req.body);
    
    // Devolvemos los datos actualizados
    res.json({ message: "Usuario actualizado", user });
  } catch (err) {
    // Si hay error, devolvemos código 400 y el mensaje
    res.status(400).json({ message: err.message });
  }
}



/**
 * Controlador para deshabilitar/eliminar lógicamente un usuario
 * 
 * Este controlador verifica los permisos del usuario que hace la petición,
 * permitiendo que un usuario elimine su propia cuenta o que un administrador
 * con el permiso adecuado deshabilite cualquier usuario.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Object} req.params - Parámetros de URL
 * @param {string} req.params.id - ID del usuario a deshabilitar
 * @param {Object} req.user - Datos del usuario autenticado (añadidos por el middleware de auth)
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Respuesta exitosa (200 OK):
 * // {
 * //   "message": "Usuario deshabilitado"
 * // }
 * 
 * @example
 * // Respuesta de error por permisos (403 Forbidden):
 * // {
 * //   "message": "No autorizado"
 * // }
*/
async function deleteUser(req, res) {
  try {
    // Extraemos el ID desde los parámetros de la URL
    const { id } = req.params;
    
    // Verificamos si el usuario tiene permiso para deshabilitar:
    // - O es el mismo usuario (elimina su propia cuenta)
    // - O tiene el permiso específico "inhabilitar_usuario"
    if (req.user.id !== id && !req.user.permisos.includes("inhabilitar_usuario")) {
      return res.status(403).json({ message: "No autorizado" });
    }
    
    // Si tiene permiso, llamamos a la acción para deshabilitar el usuario
    await deleteUserAction(id);
    
    // Devolvemos confirmación de la operación
    res.json({ message: "Usuario deshabilitado" });
  } catch (err) {
    // Si hay error, devolvemos código 400 y el mensaje
    res.status(400).json({ message: err.message });
  }
}




// Exportamos los controladores disponibles en este archivo
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
};