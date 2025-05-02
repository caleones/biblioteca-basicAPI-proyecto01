const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./database");

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Inicializar la app Express
const app = express();

// Interpreta las peticiones JSON con Express
app.use(express.json());

// Ruta de prueba de API
app.get("/", (req, res) => {
  res.status(200).json({ message: "API Biblioteca funcionando" });
});

// Se define el puerto desde .env o con el puerto por defecto
const PORT = process.env.PORT || 3000;

// Intenta conectar a MongoDB para inicializar el servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
});
