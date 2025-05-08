const UserModel = require("../models/user.model"); // Importamos el modelo de usuario




/**
 * Función para eliminar un usuario mediante borrado lógico.
 * 
 * Esta acción no elimina físicamente al usuario de la base de datos, sino que lo marca como deshabilitado (habilitado = false). Esto permite mantener el historial y referencias, evitando problemas de integridad en la base de datos.
 * 
 * @param {string} id - ID del usuario a deshabilitar
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario deshabilitado
 * @throws {Error} - Si el ID no existe o hay problemas con la operación
 * 
 * @example
 * // Deshabilitar un usuario
 * const usuarioDeshabilitado = await deleteUserAction("60f7a9b9e8b42c001f3a9a1b");
*/
async function deleteUserAction(id) {
  // Usamos findByIdAndUpdate para buscar y actualizar en una sola operación
  return UserModel.findByIdAndUpdate(
    id, // ID del usuario a "eliminar"
    { $set: { habilitado: false } }, // Marcamos como deshabilitado (borrado lógico)
    { new: true } // Devolvemos el documento actualizado
  );
}




module.exports = deleteUserAction; // Exportamos la función para usarla en otros archivos