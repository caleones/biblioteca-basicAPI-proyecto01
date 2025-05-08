const UserModel = require("../models/user.model"); // Importamos el modelo de usuario

const bcrypt = require("bcryptjs"); // Importamos bcrypt para verificar contraseñas




/**
 * Función para autenticar un usuario por correo y contraseña
 * 
 * Esta acción busca un usuario por su correo electrónico, verifica que esté
 * habilitado y comprueba que la contraseña proporcionada coincida con la almacenada.
 * 
 * @param {Object} credentials - Credenciales del usuario
 * @param {string} credentials.correo - Correo electrónico para buscar al usuario
 * @param {string} credentials.contraseña - Contraseña en texto plano para verificar
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del usuario si la autenticación es exitosa
 * @throws {Error} - "Usuario no encontrado" si el correo no existe o el usuario está deshabilitado
 * @throws {Error} - "Credenciales inválidas" si la contraseña no coincide
 * 
 * @example
 * // Uso típico en un controlador de login:
 * try {
 *   const user = await readUserAction({ 
 *     correo: "usuario@ejemplo.com", 
 *     contraseña: "clave123" 
 *   });
 *   // Usuario autenticado correctamente
 * } catch (error) {
 *   // Manejar error de autenticación
 * }
*/
async function readUserAction({ correo, contraseña }) {
  // Buscar usuario por correo y que esté habilitado
  const user = await UserModel.findOne({ correo, habilitado: true });

  // Si no se encuentra el usuario, lanzar error
  if (!user) throw new Error("Usuario no encontrado");

  // Comparar la contraseña proporcionada con la almacenada (cifrada)
  const match = await bcrypt.compare(contraseña, user.contraseña);

  // Si las contraseñas no coinciden, lanzar error
  if (!match) throw new Error("Credenciales inválidas");

  // Si todo es correcto, devolver el usuario
  return user;
}




module.exports = readUserAction; // Exportamos la función para usarla en otros archivos