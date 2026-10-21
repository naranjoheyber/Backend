const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'El título es obligatorio'], trim: true, maxlength: 180 },
  description: { type: String, trim: true, default: '', maxlength: 3000 },
  year: { type: Number, required: true, min: 1888, max: 2100 },
  genre: { type: String, required: true, trim: true, default: 'Drama' },
  posterUrl: { type: String, trim: true, default: '' },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  status: { type: String, enum: ['Publicado', 'Borrador', 'Inactivo'], default: 'Borrador' },
  type: { type: String, enum: ['Película', 'Serie'], default: 'Película' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: false });

movieSchema.index({ title: 'text', genre: 'text', description: 'text' });
module.exports = mongoose.model('Movie', movieSchema);
