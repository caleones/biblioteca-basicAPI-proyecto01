const UserModel = require("../models/user.model"); // Importamos el modelo de usuario de la base de datos

const bcrypt = require("bcryptjs"); // Importamos bcrypt para el cifrado de contraseñas




/**
 * Función para crear un nuevo usuario en la base de datos
 * @param {string} nombre - Nombre del usuario
 * @param {string} correo - Correo electrónico del usuario (único)
 * @param {string} contraseña - Contraseña en texto plano (será cifrada)
 * @param {Array} permisos - Permisos del usuario (opcional, por defecto vacío)
 * @returns {Promise} Promesa que resuelve con el usuario creado
*/
async function createUserAction({ id, nombre, correo, contraseña, permisos = [] }) {
  // Generamos un "salt" (valor aleatorio) para reforzar la seguridad del hash
  const salt = await bcrypt.genSalt(10);

  /*
    Ciframos la contraseña combinándola con el salt
    Esto genera un hash que es imposible de revertir
  */
  const hashed = await bcrypt.hash(contraseña, salt);

  /*
    Creamos una nueva instancia del modelo de usuario con los datos proporcionados sustituyendo la contraseña por su versión cifrada
  */
  const user = new UserModel({ id, nombre, correo, contraseña: hashed, permisos });

  // Guardamos el usuario en la base de datos y devolvemos el resultado
  return user.save();
}




module.exports = createUserAction; // Exportamos la función para usarla en otros archivos