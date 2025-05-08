const jwt = require("jsonwebtoken"); // Importamos JWT para verificar tokens




/**
 * Middleware para verificar autenticación mediante JWT
 * 
 * Este middleware intercepta las peticiones HTTP y verifica si incluyen
 * un token JWT válido en el header 'Authorization'. Si el token es válido,
 * añade la información del usuario decodificada a req.user y permite
 * que la petición continúe. Si no hay token o es inválido, devuelve un error.
 * 
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar con el siguiente middleware
 * 
 * @example
 * // Cabecera necesaria en la petición:
 * // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*/
function verifyToken(req, res, next) {
  // Extraer el header de autorización
  const auth = req.headers.authorization;
  
  // Si no hay header de autorización, devolver error 401 (No autorizado)
  if (!auth) return res.status(401).json({ message: "Token requerido" });
  
  // Extraer el token del formato "Bearer <token>"
  const token = auth.split(" ")[1];
  
  try {
    // Verificar y decodificar el token usando la clave secreta
    const data = jwt.verify(token, process.env.JWT_SECRET);
    
    // Añadir datos del usuario al objeto request para uso en controladores
    req.user = data; // Contiene id y permisos del usuario
    
    // Continuar con el siguiente middleware o controlador
    next();
  } catch {
    // Si el token es inválido o ha expirado, devolver error 403 (Prohibido)
    res.status(403).json({ message: "Token inválido" });
  }
}




module.exports = verifyToken; // Exportamos el middleware