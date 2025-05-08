/**
 * Middleware global para manejo centralizado de errores
 * 
 * Este middleware captura errores no manejados en rutas y middlewares anteriores
 * y envía una respuesta de error estructurada al cliente.
 * 
 * @param {Error} err - Objeto de error capturado
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
function errorHandler(err, req, res, next) {
    // Determinamos el código de estado (500 por defecto para errores del servidor)
    const statusCode = err.statusCode || 500;
    
    console.error(`[Error]: ${err.message}`);
    
    // Enviamos respuesta estructurada
    res.status(statusCode).json({
      message: err.message || 'Error interno del servidor',
      // En desarrollo podemos incluir más detalles, en producción sería mejor omitirlos
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  


  
  module.exports = errorHandler;