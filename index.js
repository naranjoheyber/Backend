require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDatabase = require('./database');
const moviesRoutes = require('./routes/movies');

const app = express();
const port = Number(process.env.PORT) || 3000;
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ name: 'Cinevo Admin API', status: 'ok', docs: '/api/health' }));
app.get('/api/health', (_req, res) => res.json({ api: 'ok', database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/movies', moviesRoutes);

app.use((req, res) => res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` }));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.name === 'ValidationError') return res.status(400).json({ message: 'Datos inválidos.', details: Object.values(error.errors).map(e => e.message) });
  if (error.name === 'CastError') return res.status(400).json({ message: 'Identificador inválido.' });
  if (error.code === 11000) return res.status(409).json({ message: 'Ya existe un registro con esos datos.' });
  res.status(500).json({ message: 'Error interno del servidor.' });
});

connectDatabase()
  .then(() => app.listen(port, () => console.log(`Cinevo API disponible en http://localhost:${port}`)))
  .catch(error => { console.error(`No se pudo iniciar Cinevo API: ${error.message}`); process.exit(1); });
