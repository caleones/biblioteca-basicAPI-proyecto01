const mongoose = require("mongoose"); // Importamos mongoose para crear el esquema y modelo




/**
 * Esquema de Usuario para MongoDB
 * 
 * Define la estructura de datos para almacenar usuarios en la base de datos.
 * Este esquema incluye información personal, credenciales, permisos y estado.
*/
const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },

    /**
     * Nombre completo del usuario.
     * 
     * Requerido para identificación en la interfaz.
    */
    nombre: {
      type: String,
      required: true,
    },
    
    /**
     * Correo electrónico del usuario.
     * 
     * Debe ser único en toda la base de datos.
     * 
     * Se usa para login y comunicaciones.
    */
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    
    /**
     * Contraseña del usuario.
     * 
     * Siempre se almacena cifrada usando bcrypt.
     * 
     * Ver: src/actions/create.user.action.js para el proceso de cifrado.
    */
    contraseña: {
      type: String,
      required: true,
    },
    
    /**
     * Lista de permisos asignados al usuario.
     * 
     * Cada permiso es un string que define una acción permitida.
     * 
     * Ejemplos: "crear_libro", "modificar_usuario", "eliminar_libro", "admin".
     * 
     * Un array vacío significa que el usuario no tiene permisos especiales.
    */
    permisos: {
      type: [String],
      default: [],
    },
    
    /**
     * Estado de activación de la cuenta.
     * 
     * Implementa un "borrado lógico" (soft delete).
     * 
     * true = usuario activo, false = usuario desactivado.
     * 
     * Usar este flag en lugar de eliminar registros permite mantener historial.
    */
    habilitado: {
      type: Boolean,
      default: true,
    },
  },
  {
    /**
     * Configuración adicional del esquema.
     * 
     * timestamps: añade automáticamente campos createdAt y updatedAt.
     * 
     * Útil para auditoría y para ordenar resultados por fecha.
    */
    timestamps: true,
  }
);



/**
 * Modelo de Usuario para MongoDB
 * 
 * Permite realizar operaciones CRUD sobre la colección 'User' en MongoDB.
 * 
 * Métodos principales:
 * - UserModel.find(): Buscar usuarios.
 * - UserModel.findById(): Buscar un usuario por ID.
 * - UserModel.findOne(): Buscar un usuario según criterios.
 * - UserModel.create(): Crear un nuevo usuario.
 * - instance.save(): Guardar cambios en un usuario existente.
 * - instance.remove(): Eliminar un usuario.
 * 
 * @example
 * // Buscar un usuario por correo
 * const usuario = await UserModel.findOne({ correo: "ejemplo@correo.com" });
 * 
 * @example
 * // Crear un nuevo usuario (ver mejor create.user.action.js para crear usuarios)
 * const nuevoUsuario = new UserModel({
 *   nombre: "Nombre Apellido",
 *   correo: "email@ejemplo.com",
 *   contraseña: "contraseñaCifrada", // Debe estar cifrada
 *   permisos: ["lector"]
 * });
 * await nuevoUsuario.save();
*/
const UserModel = mongoose.model("User", UserSchema);




// Exportamos el modelo para usarlo en otras partes de la aplicación
module.exports = UserModel;