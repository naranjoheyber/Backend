const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Falta MONGODB_URI. Crea Backend/.env a partir de .env.example.');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB conectado: ${mongoose.connection.name}`);
}

module.exports = connectDatabase;
