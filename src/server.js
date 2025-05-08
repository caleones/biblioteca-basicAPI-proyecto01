/**
 * Archivo principal del servidor Express
 * 
 * Configura, inicializa y ejecuta el servidor de la API de biblioteca.
 * Incluye configuración de seguridad, conexión a base de datos y rutas.
*/


// Importamos dependencias principales
const express = require("express"); // Framework web para Node.js
const dotenv = require("dotenv"); // Manejo de variables de entorno
const connectDB = require("./database"); // Función de conexión a MongoDB


// Middlewares de seguridad y utilidades
const cors = require("cors"); // Control de acceso entre orígenes
const helmet = require("helmet"); // Cabeceras HTTP seguras
const rateLimit = require("express-rate-limit"); // Limitador de peticiones


// Middleware personalizado de manejo de errores
const errorHandler = require("./middlewares/error.middleware");


// Rutas de la aplicación (cada entidad con su router)
const userRoutes = require("./routes/user.route"); // Rutas de usuarios
const bookRoutes = require("./routes/book.route"); // Rutas de libros
const reservationRoutes = require("./routes/reservation.route"); // Rutas de reservas


// Cargar las variables de entorno desde el archivo .env
dotenv.config();


// Inicializar la app Express
const app = express();




// Configuración de middlewares globales
// Parsear cuerpos JSON en peticiones
app.use(express.json());


// Seguridad HTTP (cabeceras, protección XSS, etc.)
app.use(helmet());


// Configurar CORS para permitir orígenes específicos o todos (*)
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));


// Limitar número de peticiones para prevenir ataques DoS
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // Ventana de tiempo: 15 minutos
    max: 100, // máximo 100 peticiones por IP en esa ventana
  })
);


// Montar las rutas de la API bajo el prefijo común /api
app.use("/api", userRoutes); // /api/users/...
app.use("/api", bookRoutes); // /api/books/...
app.use("/api", reservationRoutes); // /api/reservations/...


// Ruta de prueba para verificar que la API está funcionando
app.get("/", (req, res) => {
  res.status(200).json({ message: "API Biblioteca funcionando" });
});


// Middleware global de manejo de errores (debe ir al final)
app.use(errorHandler);


// Configuración del puerto desde variables de entorno o valor por defecto
const PORT = process.env.PORT || 3000;




// Iniciar el servidor solo después de conectar a la base de datos
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});