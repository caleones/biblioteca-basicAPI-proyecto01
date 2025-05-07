const mongoose = require("mongoose");

// Esquema de un usuario
const UserSchema = new mongoose.Schema(
  {
    // Todos los usuarios llevan un nombre y es obligatorio
    nombre: {
      type: String,
      required: true,
    },
    // Todos los usuarios requieren un correo y es obligatorio además único
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    // Todos los usuarios requieren de una contraseña para su inicio de sesión
    contraseña: {
      type: String,
      required: true,
    },
    // Todos son usuarios pero se controlan los permisos con un vector de permisos
    permisos: {
      type: [String], // por ejemplo: ["crear_libro", "modificar_usuario"]
      default: [],
    },
    // Este campo significa si el usuario está activo o eliminado y es así como se registrará su "indexación" en el sistema, si es false, no se indexa, por tanto no existe, por tanto muy seguramente fue borrado pero seguiría en la base de datos sólo que deshabilitado
    habilitado: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Creación del modelo
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;