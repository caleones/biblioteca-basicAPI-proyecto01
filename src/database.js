const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();




// Se intenta conectar a MongoDB con Mongoose
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1);
  }
}




module.exports = connectDB;