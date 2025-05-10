const UserModel = require("../models/user.model"); // Importamos el modelo de usuario




/**
 * Función para actualizar datos de un usuario existente
 * 
 * Esta acción busca un usuario por su ID y actualiza los campos
 * proporcionados, devolviendo el documento actualizado.
 * 
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} updateData - Datos a actualizar (pueden ser uno o varios campos)
 * @param {string} [updateData.nombre] - Nuevo nombre (opcional)
 * @param {string} [updateData.correo] - Nuevo correo (opcional)
 * @param {Boolean} [updateData.habilitado] - Nuevo estado (opcional)
 * @param {Array} [updateData.permisos] - Nuevos permisos (opcional)
 * 
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario actualizado
 * @throws {Error} - Si el ID no existe o hay problemas con la actualización
 * 
 * @example
 * // Actualizar solo el nombre de un usuario
 * const usuarioActualizado = await updateUserAction("60f7a9b9e8b42c001f3a9a1b", { 
 *   nombre: "Nuevo Nombre" 
 * });
*/
async function updateUserAction(id, updateData) {
  try {
    // Eliminar campos sensibles que no deberían actualizarse directamente
    delete updateData.contraseña;
    
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  } catch (error) {
    if (error.name === 'CastError') 
      throw new Error("ID de usuario inválido");
    throw error;
  }
}




module.exports = updateUserAction; // Exportamos la función para usarla en otros archivos