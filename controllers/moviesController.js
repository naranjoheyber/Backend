const Movie = require('../models/Movie');

exports.list = async (req, res, next) => {
  try {
    const { search, type, status } = req.query;
    const filter = {};
    if (type && ['Película', 'Serie'].includes(type)) filter.type = type;
    if (status && ['Publicado', 'Borrador', 'Inactivo'].includes(status)) filter.status = status;
    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [{ title: { $regex: escaped, $options: 'i' } }, { genre: { $regex: escaped, $options: 'i' } }];
    }
    const items = await Movie.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ data: items, total: items.length });
  } catch (error) { next(error); }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Movie.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Contenido no encontrado.' });
    res.json({ data: item });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Movie.create(req.body);
    res.status(201).json({ message: 'Contenido creado correctamente.', data: item });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Contenido no encontrado.' });
    res.json({ message: 'Contenido actualizado correctamente.', data: item });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Movie.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Contenido no encontrado.' });
    res.json({ message: 'Contenido eliminado correctamente.' });
  } catch (error) { next(error); }
};
