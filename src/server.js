const express = require("express");
const dotenv = require("dotenv");

// cargar las variables de entorno desde el  archivo .env
dotenv.config();

// inicializar la app Express
const app = express();

// interpreta peticiones JSON con Express
app.use(express.json());

// ruta de prueba de API
app.get("/", (req, res) => {
  res.status(200).json({ message: "API Biblioteca funcionando" });
});

// puerto definido en .env o el puerto por defecto (3000)
const PORT = process.env.PORT || 3000;

// inicializar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
